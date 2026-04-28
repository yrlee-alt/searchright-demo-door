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
import SiteHeader from "@/components/SiteHeader";

export default function AIRecruiterFlow() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const { phase, query, variant, setQuery, setVariant, setCandidateCount, goTo } = useWizardStore();

  // Initialize from URL params on mount
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
      <SiteHeader variant="transparent" />
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, #E8F1FF 0%, #F5F5F7 60%, #F5F5F7 100%)",
        }}
      >
        {/* Step progress indicator (hidden on result) */}
        <StepProgress phase={phase} />

        {/* Step content */}
        <div className="pb-20">
          {phase === "jd" && <JDLinkStep />}

          {phase === "survey" && <SurveyStep />}

          {phase === "animating" && (
            <div>
              <TerminalAnimation {...animSharedProps} />
            </div>
          )}

          {phase === "lead" && <LeadCaptureStep />}

          {phase === "result" && <ResultStep />}
        </div>
      </div>
    </>
  );
}
