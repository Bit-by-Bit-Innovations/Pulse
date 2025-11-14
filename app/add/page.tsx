"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@radix-ui/react-label";

import { Layout } from "@/components/Layout";
import { useAddWorkout } from "@/lib/useWorkouts";

type FormState = {
  type: string;
  sets: string;
  reps: string;
  weight: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  type: "",
  sets: "",
  reps: "",
  weight: "",
  notes: ""
};

const baseInputClass =
  "w-full rounded-2xl border border-border/70 bg-surface px-4 py-3 text-base text-foreground shadow-subtle transition focus:outline-none focus:ring-2 focus:ring-accent/50";

export default function AddWorkoutPage(): JSX.Element {
  const router = useRouter();
  const addWorkout = useAddWorkout();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<"idle" | "success">("idle");

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "full"
      }),
    []
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeStyle: "short"
      }),
    []
  );

  useEffect(() => {
    if (submissionState !== "success") {
      return;
    }

    const timeout = setTimeout(() => {
      router.push("/");
    }, 1800);

    return () => clearTimeout(timeout);
  }, [submissionState, router]);

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((previous) => ({ ...previous, [field]: value }));

      if (errors[field]) {
        setErrors((previous) => {
          const next = { ...previous };
          delete next[field];
          return next;
        });
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors: FormErrors = {};
    const trimmedType = form.type.trim();
    const setsValue = Number.parseInt(form.sets, 10);
    const repsValue = Number.parseInt(form.reps, 10);
    const weightInput = form.weight.trim();

    if (!trimmedType) {
      validationErrors.type = "Please enter the workout type.";
    }

    if (!Number.isInteger(setsValue) || setsValue <= 0) {
      validationErrors.sets = "Sets must be a positive whole number.";
    }

    if (!Number.isInteger(repsValue) || repsValue <= 0) {
      validationErrors.reps = "Reps must be a positive whole number.";
    }

    let weightValue: number | undefined;
    if (weightInput) {
      const parsedWeight = Number.parseFloat(weightInput);
      if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
        validationErrors.weight = "Weight must be zero or greater.";
      } else {
        weightValue = Math.round(parsedWeight * 100) / 100;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmissionState("idle");
      return;
    }

    const sanitizedNotes = form.notes.trim();

    addWorkout({
      title: trimmedType,
      performedAt: new Date().toISOString(),
      notes: sanitizedNotes.length > 0 ? sanitizedNotes : undefined,
      sets: setsValue,
      reps: repsValue,
      weight: weightValue
    });

    setForm(initialFormState);
    setErrors({});
    setSubmissionState("success");
  };

  const today = new Date();
  const dateDisplay = dateFormatter.format(today);
  const timeDisplay = timeFormatter.format(today);

  return (
    <Layout
      title="Add a workout"
      description="Capture the essential details of your training sessions so trends stay easy to follow."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <div className="rounded-3xl bg-surface/70 p-5 text-sm text-muted shadow-subtle ring-1 ring-border/40">
          <p>
            Logged for{" "}
            <span className="font-semibold text-foreground">
              {dateDisplay} · {timeDisplay}
            </span>
            . The date is captured automatically.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-foreground">
                Workout type
              </Label>
              <input
                id="type"
                name="type"
                type="text"
                inputMode="text"
                placeholder="e.g. Bench press"
                value={form.type}
                onChange={updateField("type")}
                className={baseInputClass}
                aria-invalid={Boolean(errors.type)}
                aria-describedby={errors.type ? "type-error" : undefined}
              />
              {errors.type && (
                <p id="type-error" className="text-sm font-medium text-red-500">
                  {errors.type}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sets" className="text-sm font-semibold text-foreground">
                  Sets
                </Label>
                <input
                  id="sets"
                  name="sets"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={form.sets}
                  onChange={updateField("sets")}
                  className={baseInputClass}
                  placeholder="3"
                  aria-invalid={Boolean(errors.sets)}
                  aria-describedby={errors.sets ? "sets-error" : undefined}
                />
                {errors.sets && (
                  <p id="sets-error" className="text-sm font-medium text-red-500">
                    {errors.sets}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reps" className="text-sm font-semibold text-foreground">
                  Reps
                </Label>
                <input
                  id="reps"
                  name="reps"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={form.reps}
                  onChange={updateField("reps")}
                  className={baseInputClass}
                  placeholder="10"
                  aria-invalid={Boolean(errors.reps)}
                  aria-describedby={errors.reps ? "reps-error" : undefined}
                />
                {errors.reps && (
                  <p id="reps-error" className="text-sm font-medium text-red-500">
                    {errors.reps}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="weight"
                className="flex items-center justify-between text-sm font-semibold text-foreground"
              >
                <span>Weight</span>
                <span className="text-xs font-normal text-muted">(optional)</span>
              </Label>
              <input
                id="weight"
                name="weight"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.5"
                placeholder="e.g. 45"
                value={form.weight}
                onChange={updateField("weight")}
                className={baseInputClass}
                aria-invalid={Boolean(errors.weight)}
                aria-describedby={errors.weight ? "weight-error" : undefined}
              />
              {errors.weight && (
                <p id="weight-error" className="text-sm font-medium text-red-500">
                  {errors.weight}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="flex items-center justify-between text-sm font-semibold text-foreground"
              >
                <span>Notes</span>
                <span className="text-xs font-normal text-muted">(optional)</span>
              </Label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Add cues, pacing, or observations…"
                value={form.notes}
                onChange={updateField("notes")}
                className={`${baseInputClass} resize-none`}
                aria-describedby={errors.notes ? "notes-error" : undefined}
              />
              {errors.notes && (
                <p id="notes-error" className="text-sm font-medium text-red-500">
                  {errors.notes}
                </p>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-2xl bg-foreground px-6 py-3 text-base font-semibold text-background shadow-soft transition hover:-translate-y-0.5 hover:shadow-subtle focus:outline-none focus:ring-2 focus:ring-accent/60"
          >
            Save workout
          </motion.button>
        </form>

        <AnimatePresence>
          {submissionState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-accent/15 p-5 text-foreground shadow-subtle ring-1 ring-accent/30"
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-base font-semibold">Workout added</p>
                  <p className="text-sm text-muted">
                    Redirecting you to the dashboard so you can review your training streak.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-accent px-5 py-3 text-base font-semibold text-white shadow-subtle transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-accent/60 sm:w-auto"
                >
                  Return to dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}
