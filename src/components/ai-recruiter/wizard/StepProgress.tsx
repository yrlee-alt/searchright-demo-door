"use client";

import type { Phase } from "./wizardStore";

interface StepProgressProps {
  phase: Phase;
}

const STEPS = [
  { key: "jd" as Phase, label: "JD" },
  { key: "survey" as Phase, label: "설문" },
  { key: "animating" as Phase, label: "AI 매칭" },
  { key: "lead" as Phase, label: "결과 확인" },
];

const PHASE_ORDER: Phase[] = ["jd", "survey", "animating", "lead", "result"];

function phaseIndex(phase: Phase): number {
  return PHASE_ORDER.indexOf(phase);
}

export default function StepProgress({ phase }: StepProgressProps) {
  if (phase === "result") return null;

  const currentIdx = phaseIndex(phase);
  // Map phases to step slots (result has no dot)
  const stepPhaseOrder: Phase[] = ["jd", "survey", "animating", "lead"];
  const currentStepSlot = stepPhaseOrder.indexOf(phase);
  const stepNumber = currentStepSlot + 1;

  return (
    <div className="flex flex-col items-center gap-3 pb-8 pt-6">
      <p className="text-13 font-medium text-[var(--color-fg-subtle)]">
        Step {stepNumber > 0 ? stepNumber : 1} of 4
      </p>
      <div className="flex items-center gap-3">
        {STEPS.map((step, i) => {
          const stepPhaseIdx = phaseIndex(step.key);
          const isCompleted = stepPhaseIdx < currentIdx;
          const isActive = step.key === phase;
          const isInactive = !isCompleted && !isActive;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="transition-all duration-200"
                  style={{
                    width: isActive ? "10px" : "8px",
                    height: isActive ? "10px" : "8px",
                    borderRadius: "50%",
                    backgroundColor: isInactive
                      ? "var(--color-border)"
                      : "var(--color-fg)",
                    transform: isActive ? "scale(1.25)" : "scale(1)",
                  }}
                />
                <span
                  className="text-11 font-medium transition-colors duration-200"
                  style={{
                    color: isActive
                      ? "var(--color-fg)"
                      : isCompleted
                      ? "var(--color-fg-muted)"
                      : "var(--color-fg-subtle)",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="mb-5 h-px w-8 transition-colors duration-300"
                  style={{
                    backgroundColor: isCompleted
                      ? "var(--color-fg-muted)"
                      : "var(--color-border)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
