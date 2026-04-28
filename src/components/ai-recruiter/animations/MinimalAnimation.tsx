"use client";

import { useEffect, useState } from "react";
import { SOURCES } from "./sources";

export interface SearchAnimationProps {
  query: string;
  onComplete: (candidateCount: number) => void;
}

const MINIMAL_DURATION_MS = 7000;

const STAGES = [
  "LinkedIn 검색 중...",
  "원티드·사람인·잡코리아 인덱스 분석 중...",
  "RAG 매칭 중...",
  "매칭 점수 계산 중...",
  "완료",
];

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function MinimalAnimation({ query, onComplete }: SearchAnimationProps) {
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 1500 : MINIMAL_DURATION_MS;

  const [stageIndex, setStageIndex] = useState(0);
  const [activeSources, setActiveSources] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [countDisplay, setCountDisplay] = useState(0);

  useEffect(() => {
    // Compute final count deterministically
    let h = 0;
    for (let i = 0; i < query.length; i++) {
      h = ((h << 5) - h + query.charCodeAt(i)) | 0;
    }
    const count = 12 + (Math.abs(h) % 37);

    if (reducedMotion) {
      // Short circuit: show all sources active, last stage
      setActiveSources(new Set(SOURCES.map((s) => s.key)));
      setStageIndex(STAGES.length - 1);
      setProgress(100);
      setCountDisplay(count);
      const t = setTimeout(() => {
        onComplete(count);
      }, 1500);
      return () => clearTimeout(t);
    }

    const stageInterval = duration / STAGES.length;
    const sourceInterval = duration / (SOURCES.length + 1);

    // Advance stages
    const stageTimers: ReturnType<typeof setTimeout>[] = [];
    STAGES.forEach((_, i) => {
      stageTimers.push(
        setTimeout(() => {
          setStageIndex(i);
        }, i * stageInterval),
      );
    });

    // Activate sources one by one
    SOURCES.forEach((src, i) => {
      stageTimers.push(
        setTimeout(() => {
          setActiveSources((prev) => new Set([...prev, src.key]));
        }, (i + 1) * sourceInterval),
      );
    });

    // Progress bar
    const progressStep = 50;
    let elapsed = 0;
    const progressTimer = setInterval(() => {
      elapsed += progressStep;
      setProgress(Math.min(100, (elapsed / duration) * 100));
    }, progressStep);

    // Count-up in last 2 seconds
    const countUpStart = duration - 2000;
    const countUpTimer = setTimeout(() => {
      const steps = 30;
      const stepMs = 2000 / steps;
      let step = 0;
      const countTimer = setInterval(() => {
        step++;
        setCountDisplay(Math.round((count * step) / steps));
        if (step >= steps) clearInterval(countTimer);
      }, stepMs);
      stageTimers.push(countTimer as unknown as ReturnType<typeof setTimeout>);
    }, Math.max(0, countUpStart));

    // Completion
    const doneTimer = setTimeout(() => {
      clearInterval(progressTimer);
      setProgress(100);
      setCountDisplay(count);
      onComplete(count);
    }, duration);

    return () => {
      stageTimers.forEach(clearTimeout);
      clearInterval(progressTimer);
      clearTimeout(countUpTimer);
      clearTimeout(doneTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-[320px] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white px-8 py-10 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
            <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="mt-2 text-13 text-slate-400 line-clamp-1">
            &ldquo;{query.length > 50 ? query.slice(0, 50) + "..." : query}&rdquo;
          </p>
        </div>

        {/* Stage label */}
        <div className="mb-5 text-center">
          <p className="text-15 font-medium text-slate-700 transition-all duration-300">{STAGES[stageIndex]}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Source chips */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {SOURCES.map((src) => {
            const active = activeSources.has(src.key);
            return (
              <span
                key={src.key}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-12 font-medium transition-all duration-500"
                style={
                  active
                    ? { backgroundColor: src.bgColor, color: src.textColor }
                    : { backgroundColor: "#f1f5f9", color: "#94a3b8" }
                }
              >
                <span className="font-bold">{src.monogram}</span>
                <span>{src.label}</span>
              </span>
            );
          })}
        </div>

        {/* Count display */}
        {countDisplay > 0 && (
          <div className="text-center">
            <span className="text-40 font-bold text-sky-600">{countDisplay}</span>
            <span className="ml-2 text-18 text-slate-600">명 발견</span>
          </div>
        )}
      </div>
    </div>
  );
}
