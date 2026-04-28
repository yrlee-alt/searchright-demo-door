import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AIRecruiterFlow from "./AIRecruiterFlow";

export const metadata: Metadata = {
  title: "AI 인재 검색 | SearchRight",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ q?: string; variant?: string }>;
}

export default async function AIRecruiterPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawQuery = sp.q ?? "";
  const query = rawQuery.trim();

  // No query — show a soft fallback (preserves GA funnel data, no auto-redirect)
  if (!query) {
    return (
      <>
        <div
          className="flex min-h-screen flex-col items-center justify-center gap-7 px-4 text-center"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, #E8F1FF 0%, #F5F5F7 60%, #F5F5F7 100%)",
          }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center"
            style={{
              borderRadius: "20px",
              background: "linear-gradient(135deg, #0071E3 0%, #38BDF8 100%)",
              boxShadow: "0 16px 40px rgba(0,113,227,0.30)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <div>
            <h1
              className="font-bold tracking-tight"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                letterSpacing: "-0.022em",
                color: "var(--color-fg)",
              }}
            >
              어떤 인재를 찾고 계신가요?
            </h1>
            <p
              className="mx-auto mt-3 text-16"
              style={{ maxWidth: "440px", color: "var(--color-fg-muted)", lineHeight: 1.55 }}
            >
              홈으로 돌아가 검색어를 입력해주세요. JD가 한 줄이면 AI가 14만
              프로필에서 매칭을 시작합니다.
            </p>
          </div>
          <Link
            href="https://www.searchright.net/"
            className="inline-flex items-center gap-2 font-semibold text-white transition-all duration-300"
            style={{
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #0071E3 0%, #0058B0 100%)",
              padding: "14px 26px",
              fontSize: "15px",
              boxShadow: "0 12px 30px rgba(0,113,227,0.32)",
            }}
          >
            홈으로 돌아가기
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </>
    );
  }

  return (
    <Suspense>
      <AIRecruiterFlow />
    </Suspense>
  );
}