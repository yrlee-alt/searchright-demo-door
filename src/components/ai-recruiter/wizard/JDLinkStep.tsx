"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/utils/analytics";
import { useWizardStore } from "./wizardStore";

function isValidUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function JDLinkStep() {
  const path = usePathname();
  const { jdUrl, setJdUrl, skipJd, goTo } = useWizardStore();
  const [localUrl, setLocalUrl] = useState(jdUrl);
  const [touched, setTouched] = useState(false);

  const valid = isValidUrl(localUrl.trim());
  const showError = touched && localUrl.trim().length > 0 && !valid;

  function handleNext() {
    const trimmed = localUrl.trim();
    if (!valid) return;
    setJdUrl(trimmed);
    trackEvent("ai_recruiter_jd_step_complete", path, { skipped: false });
    goTo("survey");
  }

  function handleSkip() {
    skipJd();
    trackEvent("ai_recruiter_jd_step_complete", path, { skipped: true });
    goTo("survey");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && valid) handleNext();
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-8 tablet:py-12">
      {/* Headline */}
      <div className="mb-10 text-center">
        <h1
          className="font-bold tracking-tight text-[var(--color-fg)]"
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.07,
            letterSpacing: "-0.022em",
          }}
        >
          어떤 포지션을 찾고 계신가요?
        </h1>
        <p className="mt-4 text-16 text-[var(--color-fg-muted)]">
          JD 링크를 주시면 AI가 더 정확하게 매칭합니다
        </p>
      </div>

      {/* URL Input */}
      <div className="mb-3">
        <input
          type="url"
          value={localUrl}
          onChange={(e) => {
            setLocalUrl(e.target.value);
            if (touched) setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/job/backend-lead"
          className="w-full border text-[var(--color-fg)] transition-all duration-300 placeholder:text-[var(--color-fg-subtle)] focus:outline-none"
          style={{
            borderRadius: "var(--radius-md)",
            borderColor: showError
              ? "var(--color-danger)"
              : "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            padding: "16px 20px",
            fontSize: "16px",
            minHeight: "56px",
            boxShadow: touched && valid
              ? "0 0 0 4px var(--color-accent-soft)"
              : showError
              ? "0 0 0 4px rgba(255,59,48,0.12)"
              : "none",
          }}
        />
        {showError && (
          <p className="mt-2 text-13 text-[var(--color-danger)]">
            http:// 또는 https://로 시작하는 URL을 입력해주세요
          </p>
        )}
        {!showError && (
          <p className="mt-2 text-13 text-[var(--color-fg-subtle)]">
            노션, 구글독스, 채용 플랫폼 링크 모두 가능합니다
          </p>
        )}
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleNext}
        disabled={!valid}
        className="mt-4 w-full font-semibold text-white transition-all duration-300 focus-visible:outline-none"
        style={{
          borderRadius: "9999px",
          backgroundColor: valid ? "var(--color-accent)" : "var(--color-border)",
          padding: "14px 28px",
          fontSize: "15px",
          cursor: valid ? "pointer" : "not-allowed",
          transform: "scale(1)",
        }}
        onMouseDown={(e) => {
          if (valid) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        다음
      </button>

      {/* Skip link */}
      <div className="mt-5 text-center">
        <button
          onClick={handleSkip}
          className="text-14 text-[var(--color-fg-muted)] underline-offset-2 transition-colors duration-200 hover:text-[var(--color-accent)] hover:underline"
        >
          JD가 아직 없어요 → 건너뛰기
        </button>
      </div>
    </div>
  );
}
