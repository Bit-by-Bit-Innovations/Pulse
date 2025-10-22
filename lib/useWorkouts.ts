'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { NewWorkout, Workout, WeeklyWorkoutStats } from './workouts';

type WorkoutsStore = {
  workouts: Workout[];
  hydrated: boolean;
  addWorkout: (input: NewWorkout) => Workout;
  removeWorkout: (id: string) => void;
  markHydrated: () => void;
};

const NOOP_STORAGE: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const EMPTY_WORKOUTS: Workout[] = Object.freeze([] as Workout[]);
const EMPTY_WEEKLY_STATS: WeeklyWorkoutStats[] = Object.freeze([] as WeeklyWorkoutStats[]);

const isUuidSupported = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

const createWorkoutId = (): string => {
  if (isUuidSupported()) {
    return crypto.randomUUID();
  }

  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return template.replace(/[xy]/g, (char) => {
    const random = Math.random() * 16;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return Math.floor(value).toString(16);
  });
};

const ensureUtcMidnight = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
};

const getWeekStart = (date: Date): Date => {
  const normalized = ensureUtcMidnight(date);
  const isoWeekday = (normalized.getUTCDay() + 6) % 7; // Monday as week start
  normalized.setUTCDate(normalized.getUTCDate() - isoWeekday);
  return normalized;
};

const getWeekEnd = (start: Date): Date => {
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  return end;
};

const byPerformedAtDesc = (a: Workout, b: Workout) => {
  const first = new Date(a.performedAt).getTime();
  const second = new Date(b.performedAt).getTime();
  return Number.isNaN(second) - Number.isNaN(first) || second - first;
};

const sortWorkoutsDescending = (workouts: Workout[]): Workout[] =>
  workouts.length <= 1 ? workouts.slice() : [...workouts].sort(byPerformedAtDesc);

const computeWeeklyStats = (workouts: Workout[]): WeeklyWorkoutStats[] => {
  const summaries = new Map<
    string,
    {
      start: Date;
      end: Date;
      totalWorkouts: number;
      totalDurationMinutes: number;
    }
  >();

  workouts.forEach((workout) => {
    const workoutDate = new Date(workout.performedAt);
    if (Number.isNaN(workoutDate.getTime())) {
      return;
    }

    const startOfWeek = getWeekStart(workoutDate);
    const key = startOfWeek.toISOString();
    const existing = summaries.get(key);

    if (existing) {
      existing.totalWorkouts += 1;
      existing.totalDurationMinutes += workout.durationMinutes ?? 0;
      return;
    }

    summaries.set(key, {
      start: startOfWeek,
      end: getWeekEnd(startOfWeek),
      totalWorkouts: 1,
      totalDurationMinutes: workout.durationMinutes ?? 0,
    });
  });

  return Array.from(summaries.values())
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map((summary) => ({
      weekStart: summary.start.toISOString(),
      weekEnd: summary.end.toISOString(),
      totalWorkouts: summary.totalWorkouts,
      totalDurationMinutes: summary.totalDurationMinutes,
    }));
};

const selectHydration = (state: WorkoutsStore) => state.hydrated;

const selectSortedWorkoutsInternal = (state: WorkoutsStore) =>
  sortWorkoutsDescending(state.workouts);

const createSelectRecentWorkoutsInternal = (limit: number) => (state: WorkoutsStore) =>
  sortWorkoutsDescending(state.workouts).slice(0, limit);

const selectWeeklyStatsInternal = (state: WorkoutsStore) =>
  computeWeeklyStats(state.workouts);

export const useWorkoutsStore = create<WorkoutsStore>()(
  persist(
    (set) => ({
      workouts: [],
      hydrated: false,
      addWorkout: (input) => {
        const workout: Workout = { id: createWorkoutId(), ...input };
        set((state) => ({ workouts: [...state.workouts, workout] }));
        return workout;
      },
      removeWorkout: (id) =>
        set((state) => ({ workouts: state.workouts.filter((workout) => workout.id !== id) })),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'pulse.workouts',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : NOOP_STORAGE)),
      partialize: (state) => ({ workouts: state.workouts }),
      onRehydrateStorage: () => (state, error) => {
        if (!error) {
          state?.markHydrated();
        }
      },
    }
  )
);

if (typeof window !== 'undefined') {
  const hasHydrated = useWorkoutsStore.persist?.hasHydrated?.() ?? false;
  if (hasHydrated && !useWorkoutsStore.getState().hydrated) {
    useWorkoutsStore.getState().markHydrated();
  }
}

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

const useHydrationReady = () => {
  const hydrated = useWorkoutsStore(selectHydration);
  const isClient = useIsClient();
  return isClient && hydrated;
};

const useHydratedSelector = <T,>(selector: (state: WorkoutsStore) => T, fallback: T): T => {
  const ready = useHydrationReady();
  const selected = useWorkoutsStore(selector);
  return ready ? selected : fallback;
};

export const useSortedWorkouts = () =>
  useHydratedSelector(selectSortedWorkoutsInternal, EMPTY_WORKOUTS);

export const useRecentWorkouts = (limit = 5) =>
  useHydratedSelector(createSelectRecentWorkoutsInternal(limit), EMPTY_WORKOUTS);

export const useWeeklyWorkoutStats = () =>
  useHydratedSelector(selectWeeklyStatsInternal, EMPTY_WEEKLY_STATS);

export const useAddWorkout = () => useWorkoutsStore((state) => state.addWorkout);

export const useRemoveWorkout = () => useWorkoutsStore((state) => state.removeWorkout);

export const selectSortedWorkouts = selectSortedWorkoutsInternal;
export const createSelectRecentWorkouts = createSelectRecentWorkoutsInternal;
export const selectWeeklyWorkoutStats = selectWeeklyStatsInternal;
