"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { trackEvent } from "@/utils/analytics";

interface HeroSearchBarProps {
  onValueChange?: (value: string) => void;
}

export default function HeroSearchBar({ onValueChange }: HeroSearchBarProps = {}) {
  const router = useRouter();
  const path = usePathname();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    trackEvent("home_search_submit", path, { query_length: trimmed.length });
    router.push(`/ai-recruiter?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="w-full">
      {/* Input + button: stacked on mobile, inline on desktop */}
      <div className="flex flex-col gap-2 tablet:flex-row">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            onValueChange?.(v);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="어떤 인재를 찾고 계신가요? 예: 시리즈B SaaS 백엔드 리드 5년차"
          className="flex-1 text-14 transition-all duration-300 placeholder:text-[var(--color-fg-subtle)] focus:outline-none"
          style={{
            borderRadius: "9999px",
            border: "1px solid",
            borderColor: isFocused ? "var(--color-accent)" : "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            padding: "13px 20px",
            color: "var(--color-fg)",
            boxShadow: isFocused
              ? "0 0 0 4px var(--color-accent-soft)"
              : "0 1px 2px rgba(0,0,0,0.04)",
          }}
        />
        <button
          onClick={handleSubmit}
          className="shrink-0 font-semibold text-white transition-all duration-300 focus-visible:outline-none"
          style={{
            borderRadius: "9999px",
            backgroundColor: "var(--color-accent)",
            padding: "13px 22px",
            fontSize: "14px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-accent-pressed)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-accent)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          AI로 인재 찾기
        </button>
      </div>
    </div>
  );
}