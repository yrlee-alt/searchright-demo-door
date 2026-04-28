"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchAnimationProps } from "./MinimalAnimation";

const TYPE_CHAR_MS = 38; // user-input typing speed (slower for natural feel)
const POST_TYPE_PAUSE_MS = 700; // pause after the command line
const HOLD_AFTER_MS = 900; // final pause before onComplete fires
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

interface ScriptStep {
  text: string;
  pauseMs: number;
  thinking?: boolean;
}

function buildScript(
  query: string,
  count: number,
): { cmd: string; steps: ScriptStep[] } {
  const q = query.length > 60 ? query.slice(0, 60) + "..." : query;
  return {
    cmd: `$ searchright-ai search --query "${q}"`,
    steps: [
      // Phase 1: Talent corpus connection
      {
        text: "[INFO] Connecting to talent corpus (LinkedIn / 원티드 / 사람인 / 잡코리아 / 로켓펀치)...",
        pauseMs: 1100,
        thinking: true,
      },
      {
        text: "[OK]   Streaming 6,381,402 candidate profiles indexed.",
        pauseMs: 700,
      },

      // Phase 2: Corporate graph augmentation (the RAG-emphasis lines)
      {
        text: "[INFO] Loading SearchRight 기업 그래프 (4,200 기업 · DART 공시 · 투자유치 · 뉴스 · 임직원 변동)...",
        pauseMs: 1900,
        thinking: true,
      },
      {
        text: "[INFO] Cross-referencing candidate work history × 기업 milestones...",
        pauseMs: 1600,
        thinking: true,
      },
      {
        text: "[OK]   Augmented 4,217,053 profiles with corporate context.",
        pauseMs: 600,
      },

      // Phase 3: RAG retrieval + scoring
      {
        text: "[INFO] Running RAG retrieval on talent vectors (dim=1536, KG re-rank)...",
        pauseMs: 2000,
        thinking: true,
      },
      {
        text: "[INFO] Computing match scores: 도메인 적합도 · 시니어리티 · 기업 단계 · 커리어 궤적...",
        pauseMs: 1700,
        thinking: true,
      },
      {
        text: "[OK]   Filtered by match threshold (>0.78).",
        pauseMs: 500,
      },
      {
        text: `[OK]   ${count} candidates passed final reranking.`,
        pauseMs: 700,
      },
      {
        text: "[DONE] Top matches ready. Reveal gate triggered.",
        pauseMs: 800,
      },
    ],
  };
}

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

export default function TerminalAnimation({ query, onComplete }: SearchAnimationProps) {
  const reducedMotion = useReducedMotion();

  const [committed, setCommitted] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [thinking, setThinking] = useState(false);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // Spinner ticker (always running, only rendered when thinking === true)
  useEffect(() => {
    const id = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % SPINNER.length);
    }, 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Reset on (re)mount so Strict Mode dev double-invocation starts cleanly
    setCommitted([]);
    setCurrentLine("");
    setThinking(false);
    completedRef.current = false;

    let h = 0;
    for (let i = 0; i < query.length; i++) {
      h = ((h << 5) - h + query.charCodeAt(i)) | 0;
    }
    const count = 12 + (Math.abs(h) % 37);
    const { cmd, steps } = buildScript(query, count);

    if (reducedMotion) {
      setCommitted([cmd, ...steps.map((s) => s.text)]);
      setCurrentLine("");
      const t = setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete(count);
        }
      }, 1200);
      return () => clearTimeout(t);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    // Type the command line character by character (looks like user typing)
    for (let i = 0; i <= cmd.length; i++) {
      const partial = cmd.slice(0, i);
      timers.push(
        setTimeout(() => {
          setCurrentLine(partial);
          setThinking(false);
        }, elapsed),
      );
      elapsed += TYPE_CHAR_MS;
    }

    // Commit command line + post-type pause
    timers.push(
      setTimeout(() => {
        setCommitted((prev) => [...prev, cmd]);
        setCurrentLine("");
      }, elapsed),
    );
    elapsed += POST_TYPE_PAUSE_MS;

    // Stream each subsequent log step: line appears instantly, then variable "thinking" pause
    steps.forEach((step) => {
      timers.push(
        setTimeout(() => {
          setCurrentLine(step.text);
          setThinking(!!step.thinking);
        }, elapsed),
      );
      elapsed += step.pauseMs;

      timers.push(
        setTimeout(() => {
          setCommitted((prev) => [...prev, step.text]);
          setCurrentLine("");
          setThinking(false);
        }, elapsed),
      );
    });

    // Final completion (guard against double-fire)
    elapsed += HOLD_AFTER_MS;
    timers.push(
      setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete(count);
        }
      }, elapsed),
    );

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [committed, currentLine]);

  return (
    <div className="flex min-h-[420px] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-12 text-slate-400">searchright-ai — zsh</span>
        </div>

        {/* Terminal body */}
        <div className="max-h-[460px] overflow-y-auto p-5 font-mono text-13 leading-6">
          {committed.map((line, i) => (
            <div key={i} className={lineColor(line)}>
              {line}
            </div>
          ))}
          {currentLine !== "" && (
            <div className={lineColor(currentLine)}>
              {currentLine}
              {thinking ? (
                <span className="ml-2 text-yellow-300">{SPINNER[spinnerFrame]}</span>
              ) : (
                <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-green-400" />
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

function lineColor(line: string): string {
  if (line.startsWith("[OK]")) return "text-green-400";
  if (line.startsWith("[DONE]")) return "text-sky-400";
  if (line.startsWith("[INFO]")) return "text-slate-300";
  if (line.startsWith("$")) return "text-yellow-300";
  return "text-slate-400";
}
