'use client';

import Link from "next/link";
import { motion } from "framer-motion";

import { Layout } from "@/components/Layout";
import { useCurrentWeekWorkoutStats, useRecentWorkouts } from "@/lib/useWorkouts";
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
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut"
    }
  }
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit"
});

const rangeFormatter =
  typeof Intl.DateTimeFormat.prototype.formatRange === "function"
    ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" })
    : null;
const rangeFallbackFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric"
});

const toDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatWorkoutDateTime = (value: string): string => {
  const parsed = toDate(value);

  if (!parsed) {
    return "Date unavailable";
  }

  return `${dateFormatter.format(parsed)} • ${timeFormatter.format(parsed)}`;
};

const formatWeekRange = (start: string, end: string): string => {
  const rangeStart = toDate(start);
  const rangeEnd = toDate(end);

  if (!rangeStart || !rangeEnd) {
    return "This week";
  }

  if (rangeFormatter) {
    return rangeFormatter.formatRange(rangeStart, rangeEnd);
  }

  return `${rangeFallbackFormatter.format(rangeStart)} – ${rangeFallbackFormatter.format(rangeEnd)}`;
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const buildQuickStats = (workout: Workout) => {
  const quickStats: Array<{ label: string; value: string }> = [];

  if (typeof workout.totalSets === "number") {
    quickStats.push({ label: "Sets", value: workout.totalSets.toLocaleString() });
  }

  if (typeof workout.totalReps === "number") {
    quickStats.push({ label: "Reps", value: workout.totalReps.toLocaleString() });
  }

  if (typeof workout.durationMinutes === "number") {
    quickStats.push({ label: "Duration", value: `${workout.durationMinutes} min` });
  }

  return quickStats;
};

const primaryCtaClass =
  "inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-surface transition hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";

const secondaryCtaClass =
  "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-foreground ring-1 ring-border/60 transition hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30";

const StatPill = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-foreground/80 shadow-subtle ring-1 ring-border/40">
    <span className="text-muted">{label}</span>
    <span>{value}</span>
  </span>
);

export default function HomePage(): JSX.Element {
  const recentWorkouts = useRecentWorkouts(5);
  const weeklyStats = useCurrentWeekWorkoutStats();
  const weekRangeLabel = formatWeekRange(weeklyStats.weekStart, weeklyStats.weekEnd);

  const hasWorkouts = recentWorkouts.length > 0;

  const weeklyMetricCards = [
    {
      label: "Workouts",
      value: weeklyStats.totalWorkouts.toLocaleString(),
      helper: "completed"
    },
    {
      label: "Sets",
      value: weeklyStats.totalSets.toLocaleString(),
      helper: "logged"
    },
    {
      label: "Reps",
      value: weeklyStats.totalReps.toLocaleString(),
      helper: "across sessions"
    }
  ];

  return (
    <Layout
      title="Dashboard"
      description="Review your latest training sessions, stay consistent week over week, and jump back into logging new workouts."
    >
      <motion.div
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.section
          className="flex flex-col gap-6 rounded-3xl bg-surface/60 p-6 shadow-subtle ring-1 ring-border/40 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between"
          variants={sectionVariants}
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">Overview</p>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Keep your momentum</h2>
            <p className="text-sm text-muted sm:text-base">
              Your dashboard highlights the past few sessions and keeps weekly consistency top of mind so you can decide what
              comes next.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Link href="/workouts/new" className={primaryCtaClass}>
                Add workout
              </Link>
              <Link href="/workouts" className={secondaryCtaClass}>
                View all workouts
              </Link>
            </div>
            <p className="text-xs text-muted">Tracking {weekRangeLabel}</p>
          </div>
        </motion.section>

        <motion.section className="space-y-4" variants={sectionVariants}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">This week at a glance</h2>
              <p className="text-sm text-muted">Monday – Sunday • {weekRangeLabel}</p>
            </div>
          </div>
          <motion.div className="grid gap-4 sm:grid-cols-3" variants={listVariants}>
            {weeklyMetricCards.map((metric) => (
              <motion.div
                key={metric.label}
                className="rounded-3xl bg-surface/75 p-4 shadow-subtle ring-1 ring-border/30 backdrop-blur-sm"
                variants={listItemVariants}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">{metric.label}</p>
                <p className="text-3xl font-semibold text-foreground sm:text-4xl">{metric.value}</p>
                <p className="text-xs text-muted">{metric.helper}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className="space-y-4" variants={sectionVariants}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent workouts</h2>
            {hasWorkouts ? (
              <span className="text-xs uppercase tracking-[0.3em] text-muted">
                Last {recentWorkouts.length} {recentWorkouts.length === 1 ? "session" : "sessions"}
              </span>
            ) : null}
          </div>

          {hasWorkouts ? (
            <motion.ul className="grid gap-3" variants={listVariants}>
              {recentWorkouts.map((workout) => {
                const quickStats = buildQuickStats(workout);
                const tags = (workout.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
                const notes = workout.notes?.trim();

                return (
                  <motion.li key={workout.id} className="surface-muted flex flex-col gap-4" variants={listItemVariants}>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-foreground sm:text-lg">{workout.title}</h3>
                          <p className="text-xs text-muted sm:text-sm">{formatWorkoutDateTime(workout.performedAt)}</p>
                        </div>
                        {workout.intensity ? (
                          <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                            {capitalize(workout.intensity)}
                          </span>
                        ) : null}
                      </div>

                      {quickStats.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {quickStats.map((stat) => (
                            <StatPill key={`${stat.label}-${stat.value}`} label={stat.label} value={stat.value} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted">No quick stats recorded for this workout yet.</p>
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

                      {notes ? (
                        <p className="text-sm leading-relaxed text-muted">{notes}</p>
                      ) : null}
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.div
              className="surface-muted flex flex-col items-start gap-4"
              variants={listItemVariants}
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">Log your first workout</h3>
                <p className="text-sm text-muted">
                  Add a workout to start building your history. Once you have sessions logged, quick stats will appear here to
                  highlight your progress.
                </p>
              </div>
              <Link href="/workouts/new" className={primaryCtaClass}>
                Add workout
              </Link>
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </Layout>
  );
}
