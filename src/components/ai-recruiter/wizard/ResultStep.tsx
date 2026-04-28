"use client";

import { useRouter } from "next/navigation";
import { generateFakeCandidateList } from "../lib/fakeCandidateCards";
import { useWizardStore } from "./wizardStore";

export default function ResultStep() {
  const router = useRouter();
  const { query, candidateCount, reset } = useWizardStore();
  const candidates = generateFakeCandidateList(query, candidateCount);

  function handleReset() {
    reset();
    router.push("/");
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-5 py-12 tablet:py-16">
      {/* Big number */}
      <div className="mb-4 text-center">
        <div
          className="font-bold leading-none text-[var(--color-accent)]"
          style={{
            fontSize: "clamp(72px, 10vw, 112px)",
            letterSpacing: "-0.022em",
          }}
        >
          {candidateCount}
        </div>
        <p
          className="mt-3 font-semibold text-[var(--color-fg)]"
          style={{ fontSize: "clamp(18px, 2.5vw, 24px)" }}
        >
          명의 매칭 후보를 발견했습니다
        </p>
        {query && (
          <p className="mt-2 text-14 text-[var(--color-fg-subtle)]">
            검색: {query.length > 80 ? query.slice(0, 80) + "..." : query}
          </p>
        )}
      </div>

      {/* Closing message card — placed between count and list */}
      <div
        className="mx-auto mt-10 max-w-[600px] text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-soft)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          padding: "28px 32px",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-10 w-10 items-center justify-center"
          style={{
            borderRadius: "50%",
            backgroundColor: "var(--color-accent-soft)",
          }}
        >
          <svg
            className="h-5 w-5"
            style={{ color: "var(--color-accent)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p
          className="font-semibold text-[var(--color-fg)]"
          style={{ fontSize: "16px", lineHeight: 1.5 }}
        >
          후보 리스트 전달을 위해 곧 연락드리겠습니다.
        </p>
        <p className="mt-2 text-14 text-[var(--color-fg-muted)]">담당 서치라이트 매니저가 직접 컨택드립니다.</p>
      </div>

      {/* Candidate list */}
      <div
        className="mt-10 overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-soft)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* List header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border-soft)" }}
        >
          <div>
            <p className="text-15 font-semibold" style={{ color: "var(--color-fg)" }}>
              발견된 후보 미리보기
            </p>
            <p className="mt-0.5 text-12" style={{ color: "var(--color-fg-muted)" }}>
              매칭 스코어 순 · 이름·소속은 컨택 후 공개됩니다
            </p>
          </div>
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-12 font-medium"
            style={{
              backgroundColor: "var(--color-accent-soft)",
              color: "var(--color-accent)",
            }}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            전체 블라인드
          </span>
        </div>

        {/* Rows */}
        <ul>
          {candidates.map((c, i) => (
            <li
              key={i}
              className="flex items-center gap-4 px-5 py-3.5"
              style={{
                borderBottom:
                  i === candidates.length - 1
                    ? "none"
                    : "1px solid var(--color-border-soft)",
              }}
            >
              {/* Rank */}
              <span
                className="w-6 text-right text-12 tabular-nums"
                style={{ color: "var(--color-fg-subtle)" }}
              >
                {i + 1}
              </span>

              {/* Avatar */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center text-14 font-semibold"
                style={{
                  borderRadius: "50%",
                  backgroundColor: "var(--color-surface-2)",
                  color: "var(--color-fg-muted)",
                  border: "1px solid var(--color-border-soft)",
                }}
              >
                {c.surname}
              </div>

              {/* Name + history (title removed — could leak role mismatch with search query) */}
              <div className="min-w-0 flex-1 select-none">
                <p
                  className="blur-[3px] text-15 font-semibold"
                  style={{ color: "var(--color-fg)" }}
                >
                  {c.display}
                </p>
                <p
                  className="mt-0.5 truncate blur-[2px] text-12"
                  style={{ color: "var(--color-fg-subtle)" }}
                >
                  전 {c.fromCompany} → {c.toCompany} · {c.years}년차
                </p>
              </div>

              {/* Score */}
              <div className="hidden shrink-0 items-baseline gap-1 tablet:flex">
                <span
                  className="text-20 font-bold tabular-nums"
                  style={{
                    color:
                      c.score >= 92
                        ? "var(--color-accent)"
                        : c.score >= 85
                        ? "var(--color-fg)"
                        : "var(--color-fg-muted)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {c.score}
                </span>
                <span
                  className="text-11 font-medium"
                  style={{ color: "var(--color-fg-subtle)" }}
                >
                  점
                </span>
              </div>

              {/* Score (mobile compact) */}
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-12 font-semibold tabular-nums tablet:hidden"
                style={{
                  backgroundColor:
                    c.score >= 92
                      ? "var(--color-accent-soft)"
                      : "var(--color-surface-2)",
                  color:
                    c.score >= 92
                      ? "var(--color-accent)"
                      : "var(--color-fg-muted)",
                }}
              >
                {c.score}
              </span>

              {/* Lock */}
              <svg
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--color-fg-subtle)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </li>
          ))}
        </ul>

        {/* Footer hint */}
        <div
          className="px-5 py-3 text-center text-12"
          style={{
            borderTop: "1px solid var(--color-border-soft)",
            backgroundColor: "var(--color-surface-2)",
            color: "var(--color-fg-muted)",
          }}
        >
          상세 프로필·이직 의향·연봉 정보는 서치라이트 매니저 컨택 후 단계적으로 공개됩니다.
        </div>
      </div>

      {/* Reset link */}
      <div className="mt-8 text-center">
        <button
          onClick={handleReset}
          className="text-14 text-[var(--color-fg-subtle)] underline-offset-2 transition-colors duration-200 hover:text-[var(--color-fg-muted)] hover:underline"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}
