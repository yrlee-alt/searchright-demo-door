"use client";

import HeroSearchBar from "@/components/ai-recruiter/HeroSearchBar";

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        color: "var(--color-fg)",
        background:
          "radial-gradient(60% 60% at 50% 0%, #E8F1FF 0%, #F5F5F7 55%, #F5F5F7 100%)",
      }}
    >
      {/* Decorative blobs */}
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

      <div className="relative mx-auto flex min-h-screen max-w-[760px] flex-col justify-center px-5 pb-24 pt-16 tablet:pb-32 tablet:pt-24">
        {/* Demo entry pill */}
        <div className="sr-fade-up mb-6 flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
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
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            SearchRight AI Recruiter · 데모 진입
          </span>
        </div>

        {/* Headline */}
        <h1
          className="sr-fade-up sr-fade-up-delay-1 text-center font-bold tracking-tight"
          style={{
            fontSize: "clamp(34px, 5.6vw, 60px)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            color: "var(--color-fg)",
          }}
        >
          어떤{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #0071E3 0%, #38BDF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            인재
          </span>
          를 찾고 계신가요?
        </h1>

        <p
          className="sr-fade-up sr-fade-up-delay-2 mx-auto mt-5 text-center"
          style={{
            fontSize: "clamp(15px, 1.4vw, 17px)",
            lineHeight: 1.55,
            maxWidth: "520px",
            color: "var(--color-fg-muted)",
          }}
        >
          AI가 LinkedIn·원티드·잡코리아 수백만 프로필과 SearchRight 기업 그래프를 교차 분석합니다.
        </p>

        {/* Search card */}
        <div className="sr-fade-up sr-fade-up-delay-3 mx-auto mt-10 flex w-full max-w-[860px] justify-center">
          <div
            className="w-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "1px solid var(--color-border-soft)",
              borderRadius: "var(--radius-xl)",
              padding: "16px",
              boxShadow:
                "0 24px 60px rgba(0,113,227,0.10), 0 4px 14px rgba(0,0,0,0.04)",
              backdropFilter: "blur(14px)",
            }}
          >
            <HeroSearchBar />
          </div>
        </div>

        <p
          className="sr-fade-up sr-fade-up-delay-4 mt-8 text-center text-12"
          style={{ color: "var(--color-fg-subtle)" }}
        >
          이 화면은 데모 진입용입니다. 실 사용자는 SearchRight 본사 사이트의 히어로 검색폼에서 진입합니다.
        </p>
      </div>
    </main>
  );
}
