export type WorkoutIntensity = 'low' | 'moderate' | 'high';

export interface Workout {
  /**
   * Unique identifier for the workout.
   */
  id: string;
  /**
   * Human readable title describing the session (e.g. "Morning Run").
   */
  title: string;
  /**
   * ISO 8601 timestamp for when the workout took place.
   */
  performedAt: string;
  /**
   * Total duration of the workout expressed in minutes.
   */
  durationMinutes?: number;
  /**
   * Optional intensity grouping to help with analytics.
   */
  intensity?: WorkoutIntensity;
  /**
   * Total number of sets completed during the workout.
   */
  totalSets?: number;
  /**
   * Cumulative repetitions performed across all sets in the workout.
   */
  totalReps?: number;
  /**
   * Free-form notes about the workout.
   */
  notes?: string;
  /**
   * Tags attached to the workout for filtering (e.g. ["outdoor", "gym"]).
   */
  tags?: string[];
}

export type NewWorkout = Omit<Workout, 'id'>;

export interface WeeklyWorkoutStats {
  /**
   * ISO date string representing the inclusive start of the week (UTC, Monday).
   */
  weekStart: string;
  /**
   * ISO date string representing the inclusive end of the week (UTC, Sunday).
   */
  weekEnd: string;
  /**
   * Number of workouts completed during the week.
   */
  totalWorkouts: number;
  /**
   * Aggregate duration of the week's workouts in minutes (if provided).
   */
  totalDurationMinutes: number;
  /**
   * Total sets recorded across workouts in the week.
   */
  totalSets: number;
  /**
   * Total repetitions recorded across workouts in the week.
   */
  totalReps: number;
}

export type WorkoutSelector<T> = (workouts: Workout[]) => T;
