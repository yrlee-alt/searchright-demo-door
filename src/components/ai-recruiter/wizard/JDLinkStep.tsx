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
  const { query, jdUrl, setJdUrl, skipJd, goTo } = useWizardStore();
  const [localUrl, setLocalUrl] = useState(jdUrl);
  const [touched, setTouched] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

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
    <div className="mx-auto w-full max-w-[760px] px-5 py-6 tablet:py-12">
      {/* Echoed query pill — sustains the funnel committed-cost feeling */}
      {query && (
        <div className="sr-fade-up mb-6 flex justify-center">
          <span
            className="inline-flex max-w-full items-center gap-2 truncate rounded-full px-3.5 py-1.5"
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              border: "1px solid var(--color-border-soft)",
              backdropFilter: "blur(10px)",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--color-fg-muted)",
              letterSpacing: "0.01em",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span className="truncate">
              검색어: <span style={{ color: "var(--color-fg)" }}>{query}</span>
            </span>
          </span>
        </div>
      )}

      {/* Headline */}
      <h1
        className="sr-fade-up sr-fade-up-delay-1 text-center font-bold tracking-tight"
        style={{
          fontSize: "clamp(32px, 5.2vw, 56px)",
          lineHeight: 1.06,
          letterSpacing: "-0.025em",
          color: "var(--color-fg)",
        }}
      >
        <span
          style={{
            background: "linear-gradient(135deg, #0071E3 0%, #38BDF8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          JD 링크
        </span>
        를
        <br />
        공유해 주세요
      </h1>

      <p
        className="sr-fade-up sr-fade-up-delay-2 mx-auto mt-5 text-center"
        style={{
          fontSize: "clamp(15px, 1.4vw, 17px)",
          lineHeight: 1.55,
          maxWidth: "560px",
          color: "var(--color-fg-muted)",
        }}
      >
        검색하신 포지션의 채용 공고가 있으면 AI 매칭 정확도가 크게 올라갑니다.
      </p>

      {/* Glass input card */}
      <div
        className="sr-fade-up sr-fade-up-delay-3 mx-auto mt-10 w-full"
        style={{
          maxWidth: "640px",
          backgroundColor: "rgba(255,255,255,0.6)",
          border: "1px solid var(--color-border-soft)",
          borderRadius: "var(--radius-xl)",
          padding: "16px",
          boxShadow:
            "0 24px 60px rgba(0,113,227,0.10), 0 4px 14px rgba(0,0,0,0.04)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div className="flex flex-col gap-2.5 tablet:flex-row tablet:items-center">
          <div className="relative flex-1">
            {/* Link icon */}
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-fg-subtle)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <input
              type="url"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => {
                setInputFocused(false);
                setTouched(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com/job/backend-lead"
              className="w-full transition-all duration-200 placeholder:text-[var(--color-fg-subtle)] focus:outline-none"
              style={{
                borderRadius: "9999px",
                border: "1px solid",
                borderColor: showError
                  ? "var(--color-danger)"
                  : inputFocused
                  ? "var(--color-accent)"
                  : "var(--color-border)",
                backgroundColor: "var(--color-surface)",
                padding: "13px 20px 13px 42px",
                fontSize: "15px",
                color: "var(--color-fg)",
                boxShadow: showError
                  ? "0 0 0 4px rgba(255,59,48,0.12)"
                  : inputFocused
                  ? "0 0 0 4px var(--color-accent-soft)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            />
          </div>

          <button
            onClick={handleNext}
            disabled={!valid}
            className="shrink-0 font-semibold text-white transition-all duration-200 focus-visible:outline-none"
            style={{
              borderRadius: "9999px",
              background: valid
                ? "linear-gradient(135deg, #0071E3 0%, #0058B0 100%)"
                : "var(--color-border)",
              padding: "13px 24px",
              fontSize: "14px",
              cursor: valid ? "pointer" : "not-allowed",
              boxShadow: valid ? "0 8px 20px rgba(0,113,227,0.28)" : "none",
              transform: "scale(1)",
            }}
            onMouseDown={(e) => {
              if (valid) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
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
        </div>

        {/* Helper / error line inside card */}
        <p
          className="mt-3 px-2 text-13"
          style={{
            color: showError ? "var(--color-danger)" : "var(--color-fg-subtle)",
          }}
        >
          {showError
            ? "http:// 또는 https://로 시작하는 URL을 입력해주세요"
            : "노션, 구글독스, 채용 플랫폼 링크 모두 가능합니다"}
        </p>
      </div>

      {/* Skip — secondary, but legible */}
      <div className="sr-fade-up sr-fade-up-delay-4 mt-7 text-center">
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 text-14 font-medium transition-colors duration-200"
          style={{ color: "var(--color-fg-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-fg-muted)";
          }}
        >
          JD가 아직 없어요
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
          <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
            건너뛰기
          </span>
        </button>
      </div>
    </div>
  );
}
