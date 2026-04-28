import { create } from "zustand";
import type { Variant } from "../lib/variants";

export type SurveyAnswers = {
  urgency?: "asap" | "1m" | "q1" | "open";
  headcount?: "one" | "few" | "team" | "scale";
  companyStage?: "seed_a" | "bc" | "late" | "corp";
  progressStatus?: "start" | "inhouse" | "mixed" | "external";
};

export type Phase = "jd" | "survey" | "animating" | "lead" | "result";

interface WizardState {
  phase: Phase;
  query: string;
  variant: Variant;
  jdUrl: string;
  jdSkipped: boolean;
  survey: SurveyAnswers;
  surveyIndex: number; // 0..3
  contact: { personName: string; email: string; phone: string; companyName: string };
  candidateCount: number;

  setQuery: (q: string) => void;
  setVariant: (v: Variant) => void;
  setJdUrl: (url: string) => void;
  skipJd: () => void;
  setSurveyAnswer: <K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => void;
  nextSurvey: () => void;
  prevSurvey: () => void;
  setContact: (patch: Partial<WizardState["contact"]>) => void;
  setCandidateCount: (n: number) => void;
  goTo: (phase: Phase) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  phase: "jd",
  query: "",
  variant: "terminal",
  jdUrl: "",
  jdSkipped: false,
  survey: {},
  surveyIndex: 0,
  contact: { personName: "", email: "", phone: "", companyName: "" },
  candidateCount: 0,
  setQuery: (q) => set({ query: q }),
  setVariant: (v) => set({ variant: v }),
  setJdUrl: (url) => set({ jdUrl: url, jdSkipped: false }),
  skipJd: () => set({ jdSkipped: true, jdUrl: "" }),
  setSurveyAnswer: (key, value) => set((s) => ({ survey: { ...s.survey, [key]: value } })),
  nextSurvey: () => set((s) => ({ surveyIndex: Math.min(3, s.surveyIndex + 1) })),
  prevSurvey: () => set((s) => ({ surveyIndex: Math.max(0, s.surveyIndex - 1) })),
  setContact: (patch) => set((s) => ({ contact: { ...s.contact, ...patch } })),
  setCandidateCount: (n) => set({ candidateCount: n }),
  goTo: (phase) => set({ phase }),
  reset: () =>
    set({
      phase: "jd",
      jdUrl: "",
      jdSkipped: false,
      survey: {},
      surveyIndex: 0,
      contact: { personName: "", email: "", phone: "", companyName: "" },
      candidateCount: 0,
    }),
}));
