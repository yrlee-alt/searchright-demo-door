"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/utils/analytics";
import { parseVariant } from "@/components/ai-recruiter/lib/variants";
import { useWizardStore } from "@/components/ai-recruiter/wizard/wizardStore";
import StepProgress from "@/components/ai-recruiter/wizard/StepProgress";
import JDLinkStep from "@/components/ai-recruiter/wizard/JDLinkStep";
import SurveyStep from "@/components/ai-recruiter/wizard/SurveyStep";
import LeadCaptureStep from "@/components/ai-recruiter/wizard/LeadCaptureStep";
import ResultStep from "@/components/ai-recruiter/wizard/ResultStep";
import TerminalAnimation from "@/components/ai-recruiter/animations/TerminalAnimation";

export default function AIRecruiterFlow() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const { phase, query, variant, setQuery, setVariant, setCandidateCount, goTo } = useWizardStore();

  useEffect(() => {
    const rawQuery = searchParams.get("q") ?? "";
    const trimmed = rawQuery.trim();
    const v = parseVariant(searchParams.get("variant"));
    setQuery(trimmed);
    setVariant(v);

    trackEvent("ai_recruiter_landing_view", path, {
      variant: v,
      has_query: trimmed.length > 0,
      query_length: trimmed.length,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnimationComplete(count: number) {
    trackEvent("ai_recruiter_animation_complete", path, { variant });
    setCandidateCount(count);
    goTo("lead");
  }

  const animSharedProps = { query, onComplete: handleAnimationComplete };

  return (
    <>
      <div
        className="relative min-h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, #E8F1FF 0%, #F5F5F7 60%, #F5F5F7 100%)",
        }}
      >
        {/* Decorative blobs — same vocabulary as home hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(0,113,227,0.32), rgba(56,189,248,0) 70%)",
            animation: "sr-blob 18s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, rgba(56,189,248,0.32), rgba(0,113,227,0) 70%)",
            animation: "sr-blob 22s ease-in-out infinite reverse",
          }}
        />

        <div className="relative flex min-h-screen flex-col">
          <StepProgress phase={phase} />

          <div className="flex flex-1 flex-col justify-center pb-32 tablet:pb-40">
            {phase === "jd" && <JDLinkStep />}
            {phase === "survey" && <SurveyStep />}
            {phase === "animating" && <TerminalAnimation {...animSharedProps} />}
            {phase === "lead" && <LeadCaptureStep />}
            {phase === "result" && <ResultStep />}
          </div>
        </div>
      </div>
    </>
  );
}
