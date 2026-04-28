"use client";

import HeroSearchBar from "@/components/ai-recruiter/HeroSearchBar";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main style={{ color: "var(--color-fg)" }}>
        {/* ================== HERO ================== */}
        <section
          id="hero"
          className="relative overflow-hidden"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, #E8F1FF 0%, #F5F5F7 55%, #F5F5F7 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(0,113,227,0.35), rgba(56,189,248,0) 70%)",
              animation: "sr-blob 18s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 70% 70%, rgba(56,189,248,0.35), rgba(0,113,227,0) 70%)",
              animation: "sr-blob 22s ease-in-out infinite reverse",
            }}
          />

          <div className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col justify-center px-5 pb-24 pt-14 tablet:px-8 tablet:pb-32 tablet:pt-24">
            {/* Eyebrow pill */}
            <div className="sr-fade-up flex justify-center">
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
                  style={{ backgroundColor: "var(--color-success)" }}
                />
                서치라이트 AI · 기업 그래프 기반 인재 검색
              </span>
            </div>

            {/* Headline */}
            <h1
              className="sr-fade-up sr-fade-up-delay-1 mx-auto mt-7 text-center font-bold tracking-tight"
              style={{
                fontSize: "clamp(40px, 7vw, 76px)",
                lineHeight: 1.04,
                letterSpacing: "-0.028em",
                maxWidth: "920px",
                color: "var(--color-fg)",
              }}
            >
              채용 공고로 만날 수 없는
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #0071E3 0%, #38BDF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                핵심 인재
              </span>
              <span style={{ color: "var(--color-fg)" }}>를 찾습니다</span>
            </h1>

            {/* Subhead */}
            <p
              className="sr-fade-up sr-fade-up-delay-2 mx-auto mt-6 text-center"
              style={{
                fontSize: "clamp(16px, 1.6vw, 19px)",
                lineHeight: 1.55,
                maxWidth: "640px",
                color: "var(--color-fg-muted)",
              }}
            >
              AI가 LinkedIn·원티드·잡코리아 수백만 프로필과
              <br className="hidden tablet:inline" />
              SearchRight 기업 그래프를 교차 분석합니다. 1주 내 커피챗까지.
            </p>

            {/* Search bar */}
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

            {/* Micro trust strip */}
            <div className="sr-fade-up sr-fade-up-delay-4 mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              <TrustItem icon={<IconCoins />} label="헤드헌팅 1/3 비용" />
              <TrustItem icon={<IconBolt />} label="평균 응답 24시간" />
              <TrustItem icon={<IconLock />} label="회신율 3배" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ================== Sub-components ================== */

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{ color: "var(--color-fg-muted)", fontSize: "13px" }}
    >
      <span
        className="inline-flex h-4 w-4 items-center justify-center"
        style={{ color: "var(--color-accent)" }}
      >
        {icon}
      </span>
      {label}
    </span>
  );
}

/* Inline icons */
function IconCoins() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <ellipse cx="12" cy="6" rx="8" ry="3" strokeLinecap="round" strokeLinejoin="round" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6v5c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 11v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5"
      />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
