"use client";

import { useEffect, useState } from "react";
import type { SearchAnimationProps } from "./MinimalAnimation";
import { SOURCES } from "./sources";

const TOTAL_DURATION_MS = 8000;

const STAGE_LABELS = [
  "소스 연결 중...",
  "LinkedIn 스캔 중...",
  "원티드 스캔 중...",
  "사람인 스캔 중...",
  "잡코리아 스캔 중...",
  "로켓펀치 스캔 중...",
  "매칭 점수 계산 중...",
  "완료",
];

// Positions for 5 source logos in a circle around center
// cx=150, cy=150, r=90, starting from top, clockwise
const SOURCE_POSITIONS = [
  { cx: 150, cy: 60 },  // top (LinkedIn)
  { cx: 226, cy: 103 }, // top-right (원티드)
  { cx: 226, cy: 197 }, // bottom-right (사람인)
  { cx: 74, cy: 197 },  // bottom-left (잡코리아)
  { cx: 74, cy: 103 },  // top-left (로켓펀치)
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

export default function ScannerAnimation({ query, onComplete }: SearchAnimationProps) {
  const reducedMotion = useReducedMotion();

  const [scannedIndex, setScannedIndex] = useState(-1);
  const [stageLabel, setStageLabel] = useState(STAGE_LABELS[0]);
  const [countDisplay, setCountDisplay] = useState(0);
  const [pulsing, setPulsing] = useState<number | null>(null);

  useEffect(() => {
    // Reset on (re)mount so Strict Mode dev double-invocation starts cleanly
    setScannedIndex(-1);
    setStageLabel(STAGE_LABELS[0]);
    setCountDisplay(0);
    setPulsing(null);

    let h = 0;
    for (let i = 0; i < query.length; i++) {
      h = ((h << 5) - h + query.charCodeAt(i)) | 0;
    }
    const count = 12 + (Math.abs(h) % 37);

    if (reducedMotion) {
      setScannedIndex(SOURCES.length - 1);
      setStageLabel(STAGE_LABELS[STAGE_LABELS.length - 1]);
      setCountDisplay(count);
      const t = setTimeout(() => onComplete(count), 1500);
      return () => clearTimeout(t);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const scanInterval = (TOTAL_DURATION_MS * 0.7) / SOURCES.length;

    // Scan each source sequentially
    SOURCES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setStageLabel(STAGE_LABELS[i + 1]);
          setPulsing(i);
          setTimeout(() => {
            setScannedIndex(i);
            setPulsing(null);
          }, 400);
        }, 800 + i * scanInterval),
      );
    });

    // After all sources scanned, show count-up
    const countUpStart = 800 + SOURCES.length * scanInterval;
    timers.push(
      setTimeout(() => {
        setStageLabel("매칭 점수 계산 중...");
        const steps = 25;
        const stepMs = (TOTAL_DURATION_MS - countUpStart - 400) / steps;
        let step = 0;
        const interval = setInterval(() => {
          step++;
          setCountDisplay(Math.round((count * step) / steps));
          if (step >= steps) clearInterval(interval);
        }, stepMs);
        timers.push(interval as unknown as ReturnType<typeof setTimeout>);
      }, countUpStart),
    );

    // Complete
    timers.push(
      setTimeout(() => {
        setStageLabel("완료");
        setCountDisplay(count);
        onComplete(count);
      }, TOTAL_DURATION_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-[400px] items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        {/* SVG radar */}
        <div className="relative">
          <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
            {/* Faint circle guide */}
            <circle cx="150" cy="150" r="90" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

            {/* Pulse lines from center to each source */}
            {SOURCES.map((src, i) => {
              const pos = SOURCE_POSITIONS[i];
              const isScanned = scannedIndex >= i;
              const isPulsing = pulsing === i;
              return (
                <g key={src.key}>
                  <line
                    x1="150"
                    y1="150"
                    x2={pos.cx}
                    y2={pos.cy}
                    stroke={isScanned ? src.bgColor : "#e2e8f0"}
                    strokeWidth={isScanned ? 2 : 1}
                    strokeOpacity={isScanned ? 0.6 : 1}
                    className="transition-all duration-500"
                  />
                  {isPulsing && (
                    <circle cx={pos.cx} cy={pos.cy} r="22" fill={src.bgColor} fillOpacity="0.25">
                      <animate attributeName="r" from="18" to="28" dur="0.4s" fill="freeze" />
                      <animate attributeName="fill-opacity" from="0.4" to="0" dur="0.4s" fill="freeze" />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Source logo chips */}
            {SOURCES.map((src, i) => {
              const pos = SOURCE_POSITIONS[i];
              const isScanned = scannedIndex >= i;
              const isPulsing = pulsing === i;
              return (
                <g key={src.key} style={{ transition: "all 0.4s" }}>
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r="22"
                    fill={isScanned ? src.bgColor : "#f1f5f9"}
                    stroke={isPulsing ? src.bgColor : "transparent"}
                    strokeWidth="3"
                    className="transition-all duration-500"
                  />
                  <text
                    x={pos.cx}
                    y={pos.cy + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="system-ui, sans-serif"
                    fill={isScanned ? "#ffffff" : "#94a3b8"}
                    className="transition-all duration-500"
                  >
                    {src.monogram}
                  </text>
                </g>
              );
            })}

            {/* Center SearchRight badge */}
            <circle cx="150" cy="150" r="30" fill="#0ea5e9" />
            <text x="150" y="145" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff" fontFamily="system-ui, sans-serif">
              Search
            </text>
            <text x="150" y="159" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff" fontFamily="system-ui, sans-serif">
              Right
            </text>

            {/* Rotating scan pulse from center */}
            {scannedIndex < SOURCES.length - 1 && !reducedMotion && (
              <circle cx="150" cy="150" r="10" fill="#38bdf8" fillOpacity="0.4">
                <animate attributeName="r" values="10;90;10" dur="2s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>

        {/* Stage label */}
        <div className="text-center">
          <p className="text-15 font-medium text-slate-700">{stageLabel}</p>
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
