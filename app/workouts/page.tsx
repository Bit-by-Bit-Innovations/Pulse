"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Layout } from "@/components/Layout";
import { useRemoveWorkout, useSortedWorkouts } from "@/lib/useWorkouts";
import type { Workout } from "@/lib/workouts";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.12
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut"
    }
  }
};

const cardInitial = { opacity: 0, y: 12, scale: 0.98 };
const cardAnimate = { opacity: 1, y: 0, scale: 1 };
const cardExit = { opacity: 0, y: -12, scale: 0.96 };
const cardTransition = { duration: 0.3, ease: "easeOut" };

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "short",
  day: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit"
});

const primaryCtaClass =
  "inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-surface transition hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";

const destructiveButtonClass =
  "inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-red-500 ring-1 ring-red-200/60 transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50";

type WorkoutGroup = {
  key: string;
  label: string;
  sortValue: number;
  workouts: Workout[];
};

const MetricPill = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-foreground/80 shadow-subtle ring-1 ring-border/40">
    <span className="text-muted">{label}</span>
    <span>{value}</span>
  </span>
);

const toValidDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const groupWorkoutsByDay = (workouts: Workout[]): WorkoutGroup[] => {
  const groups: WorkoutGroup[] = [];
  const index = new Map<string, number>();

  workouts.forEach((workout) => {
    const parsed = toValidDate(workout.performedAt);
    const normalized = parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()) : null;

    const key = normalized ? normalized.toISOString() : "invalid";
    const label = parsed ? dateFormatter.format(parsed) : "Date unavailable";
    const sortValue = normalized ? normalized.getTime() : Number.NEGATIVE_INFINITY;

    const existingIndex = index.get(key);

    if (existingIndex !== undefined) {
      groups[existingIndex].workouts.push(workout);
      return;
    }

    const group: WorkoutGroup = {
      key,
      label,
      sortValue,
      workouts: [workout]
    };

    index.set(key, groups.length);
    groups.push(group);
  });

  return groups.sort((first, second) => second.sortValue - first.sortValue);
};

const buildMetrics = (workout: Workout): Array<{ label: string; value: string }> => {
  const metrics: Array<{ label: string; value: string }> = [];

  if (typeof workout.durationMinutes === "number" && workout.durationMinutes > 0) {
    metrics.push({ label: "Duration", value: `${workout.durationMinutes} min` });
  }

  const setsValue =
    typeof workout.totalSets === "number" ? workout.totalSets : typeof workout.sets === "number" ? workout.sets : undefined;

  if (typeof setsValue === "number") {
    metrics.push({ label: "Sets", value: setsValue.toLocaleString() });
  }

  const repsValue =
    typeof workout.totalReps === "number" ? workout.totalReps : typeof workout.reps === "number" ? workout.reps : undefined;

  if (typeof repsValue === "number") {
    metrics.push({ label: "Reps", value: repsValue.toLocaleString() });
  }

  if (typeof workout.weight === "number") {
    metrics.push({ label: "Weight", value: workout.weight.toLocaleString() });
  }

  return metrics;
};

const formatTimeLabel = (value: string): string => {
  const parsed = toValidDate(value);
  return parsed ? timeFormatter.format(parsed) : "Time unavailable";
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export default function WorkoutsPage(): JSX.Element {
  const workouts = useSortedWorkouts();
  const removeWorkout = useRemoveWorkout();

  const groups = useMemo(() => groupWorkoutsByDay(workouts), [workouts]);
  const hasWorkouts = groups.length > 0;

  const handleDelete = (workout: Workout) => {
    const title = workout.title.trim();
    const confirmationMessage = title
      ? `Remove "${title}" from your workout history?`
      : "Remove this workout from your history?";

    if (typeof window !== "undefined" && window.confirm(confirmationMessage)) {
      removeWorkout(workout.id);
    }
  };

  return (
    <Layout
      title="Workouts"
      description="Browse your sessions grouped by day, revisit notes, and keep building momentum in your training log."
    >
      <motion.div className="flex flex-col gap-8" variants={containerVariants} initial="hidden" animate="show">
        <motion.section
          className="rounded-3xl bg-surface/60 p-6 shadow-subtle ring-1 ring-border/40 backdrop-blur-sm"
          variants={sectionVariants}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">History</p>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Your logged workouts</h2>
              <p className="text-sm text-muted">
                Entries are sorted from most recent to oldest and grouped by the day they were performed.
              </p>
            </div>
            <Link href="/add" className={primaryCtaClass}>
              Log a workout
            </Link>
          </div>
        </motion.section>

        <motion.section className="space-y-6" variants={sectionVariants}>
          <AnimatePresence initial={false} mode="sync">
            {hasWorkouts ? (
              groups.map((group) => (
                <motion.article
                  key={group.key}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">{group.label}</p>
                    <span className="text-xs text-muted">
                      {group.workouts.length} {group.workouts.length === 1 ? "session" : "sessions"}
                    </span>
                  </div>

                  <motion.ul className="grid gap-4 md:grid-cols-2" layout>
                    <AnimatePresence initial={false} mode="popLayout">
                      {group.workouts.map((workout) => {
                        const metrics = buildMetrics(workout);
                        const tags = (workout.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
                        const notes = workout.notes?.trim();

                        return (
                          <motion.li
                            key={workout.id}
                            layout
                            initial={cardInitial}
                            animate={cardAnimate}
                            exit={cardExit}
                            transition={cardTransition}
                            className="surface-muted flex flex-col gap-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-1">
                                <h3 className="text-base font-semibold text-foreground sm:text-lg">{workout.title}</h3>
                                <p className="text-xs text-muted sm:text-sm">{formatTimeLabel(workout.performedAt)}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                {workout.intensity ? (
                                  <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent">
                                    {capitalize(workout.intensity)}
                                  </span>
                                ) : null}
                                <button type="button" onClick={() => handleDelete(workout)} className={destructiveButtonClass}>
                                  Delete
                                </button>
                              </div>
                            </div>

                            {metrics.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {metrics.map((metric) => (
                                  <MetricPill key={`${metric.label}-${metric.value}`} label={metric.label} value={metric.value} />
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted">No metrics recorded for this workout yet.</p>
                            )}

                            {tags.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full bg-surface/70 px-3 py-1 text-xs font-medium text-muted"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            {notes ? <p className="text-sm leading-relaxed text-muted">{notes}</p> : null}
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </motion.ul>
                </motion.article>
              ))
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="surface-muted flex flex-col gap-4"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">No workouts yet</h3>
                  <p className="text-sm text-muted">
                    Log your first session to start building a history. Workouts you add will appear here with smooth transitions.
                  </p>
                </div>
                <Link href="/add" className={primaryCtaClass}>
                  Add your first workout
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </Layout>
  );
}
