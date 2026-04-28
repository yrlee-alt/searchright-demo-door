"use client";

import Link from "next/link";

interface SiteHeaderProps {
  variant?: "default" | "transparent";
}

export default function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isTransparent = variant === "transparent";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: isTransparent
          ? "rgba(255,255,255,0.72)"
          : "rgba(255,255,255,0.86)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid var(--color-border-soft)",
      }}
    >
      <div className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between px-5 tablet:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
        >
          <div
            className="flex h-7 w-7 items-center justify-center"
            style={{
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, #0071E3 0%, #38BDF8 100%)",
              boxShadow: "0 4px 14px rgba(0,113,227,0.25)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <span
            className="font-semibold tracking-tight"
            style={{ fontSize: "16px", color: "var(--color-fg)" }}
          >
            SearchRight
          </span>
          <span
            className="ml-1 hidden rounded-full px-2 py-0.5 text-11 font-medium tablet:inline-block"
            style={{
              backgroundColor: "var(--color-accent-soft)",
              color: "var(--color-accent)",
              letterSpacing: "0.02em",
            }}
          >
            AI Recruiter
          </span>
        </Link>

        <a
          href="https://www.searchright.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white transition-all duration-200"
          style={{
            borderRadius: "9999px",
            background:
              "linear-gradient(135deg, #0071E3 0%, #0058B0 100%)",
            padding: "8px 16px",
            fontSize: "13px",
            boxShadow: "0 4px 14px rgba(0,113,227,0.28)",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          }}
        >
          홈페이지
        </a>
      </div>
    </header>
  );
}
