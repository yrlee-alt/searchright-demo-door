"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "@/utils/analytics";
import { useWizardStore } from "./wizardStore";
import { SURVEY_QUESTIONS } from "./surveyQuestions";

type AnimState = "entering" | "idle" | "exiting";

export default function SurveyStep() {
  const path = usePathname();
  const { surveyIndex, survey, setSurveyAnswer, nextSurvey, prevSurvey, goTo } = useWizardStore();
  const [animState, setAnimState] = useState<AnimState>("entering");
  const [pendingAdvance, setPendingAdvance] = useState<boolean>(false);

  const question = SURVEY_QUESTIONS[surveyIndex];
  const currentAnswer = survey[question.key];

  // Enter animation on mount and on question change
  useEffect(() => {
    setAnimState("entering");
    const t = setTimeout(() => setAnimState("idle"), 20);
    return () => clearTimeout(t);
  }, [surveyIndex]);

  // After exit animation completes, advance
  useEffect(() => {
    if (animState === "exiting" && pendingAdvance) {
      const t = setTimeout(() => {
        setPendingAdvance(false);
        if (surveyIndex >= 3) {
          goTo("animating");
        } else {
          nextSurvey();
        }
      }, 280);
      return () => clearTimeout(t);
    }
  }, [animState, pendingAdvance]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(value: string) {
    // Type-safe: the SURVEY_QUESTIONS array keys match SurveyAnswers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSurveyAnswer(question.key as any, value as any);
    trackEvent("ai_recruiter_survey_answer", path, {
      question: question.key,
      value,
    });

    if (surveyIndex >= 3) {
      trackEvent("ai_recruiter_survey_complete", path, {});
    }

    // Trigger exit animation, then advance
    setAnimState("exiting");
    setPendingAdvance(true);
  }

  function handleBack() {
    if (surveyIndex === 0) {
      goTo("jd");
    } else {
      prevSurvey();
    }
  }

  const isVisible = animState === "idle";

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-8 tablet:py-12">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="mb-8 flex items-center gap-2 text-14 font-medium text-[var(--color-fg-muted)] transition-colors duration-200 hover:text-[var(--color-fg)]"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        뒤로
      </button>

      {/* Sub-progress */}
      <div
        className="mb-6 transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <p className="text-13 font-medium text-[var(--color-fg-subtle)]">
          질문 {surveyIndex + 1} / 4
        </p>
      </div>

      {/* Question */}
      <div
        className="mb-8 transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          transitionDelay: isVisible ? "40ms" : "0ms",
        }}
      >
        <h2
          className="font-bold tracking-tight text-[var(--color-fg)]"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.022em",
          }}
        >
          {question.title}
        </h2>
        {"subtitle" in question && question.subtitle && (
          <p className="mt-3 text-16 text-[var(--color-fg-muted)]">{question.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div
        className="flex flex-col gap-3 transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          transitionDelay: isVisible ? "80ms" : "0ms",
        }}
      >
        {question.options.map((opt) => {
          const selected = currentAnswer === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="w-full cursor-pointer text-left transition-all duration-300 focus-visible:outline-none"
              style={{
                backgroundColor: selected ? "var(--color-accent-soft)" : "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: selected ? "var(--color-accent)" : "var(--color-border-soft)",
                padding: "20px 24px",
                boxShadow: selected
                  ? "0 8px 30px rgba(0,0,0,0.06)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (!selected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--color-accent)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 8px 30px rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!selected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--color-border-soft)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 1px 2px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = selected
                  ? "translateY(0)"
                  : "translateY(-2px)";
              }}
            >
              <p
                className="font-semibold"
                style={{
                  fontSize: "16px",
                  color: selected ? "var(--color-accent)" : "var(--color-fg)",
                }}
              >
                {opt.label}
              </p>
              {"description" in opt && opt.description && (
                <p className="mt-1 text-14 text-[var(--color-fg-muted)]">
                  {opt.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
