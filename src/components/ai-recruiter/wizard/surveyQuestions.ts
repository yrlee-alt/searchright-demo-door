import type { SurveyAnswers } from "./wizardStore";

export interface SurveyOption<V extends string> {
  value: V;
  label: string;
  description?: string;
}

export interface SurveyQuestion<K extends keyof SurveyAnswers> {
  key: K;
  title: string;
  subtitle?: string;
  options: SurveyOption<NonNullable<SurveyAnswers[K]>>[];
}

export const SURVEY_QUESTIONS = [
  {
    key: "urgency" as const,
    title: "채용 시급도는 어떻게 되시나요?",
    options: [
      { value: "asap" as const, label: "이번 달 내", description: "가장 시급" },
      { value: "1m" as const, label: "1개월 내" },
      { value: "q1" as const, label: "1분기 내" },
      { value: "open" as const, label: "정해지지 않음", description: "탑 인재가 보이면 컨택" },
    ],
  },
  {
    key: "headcount" as const,
    title: "이 자리에 몇 분을 모시나요?",
    subtitle: "단일 채용인지, 팀 빌딩인지에 따라 매칭 풀이 달라집니다.",
    options: [
      { value: "one" as const, label: "1명", description: "단일 포지션" },
      { value: "few" as const, label: "2~3명", description: "소규모 채용" },
      { value: "team" as const, label: "4~10명", description: "팀 빌딩 단계" },
      { value: "scale" as const, label: "10명+", description: "대규모 스케일업" },
    ],
  },
  {
    key: "companyStage" as const,
    title: "회사·팀 단계는 어떻게 되시나요?",
    subtitle: "후보가 가장 관심 가질 셀링 포인트를 잡는 데 사용됩니다.",
    options: [
      { value: "seed_a" as const, label: "시드 ~ 시리즈 A", description: "초기 단계" },
      { value: "bc" as const, label: "시리즈 B ~ C", description: "PMF 검증 단계" },
      { value: "late" as const, label: "시리즈 C+ · IPO 전", description: "후기 단계" },
      { value: "corp" as const, label: "상장사·중견·외국계", description: "안정 단계" },
    ],
  },
  {
    key: "progressStatus" as const,
    title: "현재 채용 진행 상황은 어떻게 되시나요?",
    options: [
      { value: "start" as const, label: "막 시작", description: "이번이 첫 시도" },
      { value: "inhouse" as const, label: "자체 진행 중", description: "1~2개월 내부 채용 중" },
      { value: "mixed" as const, label: "자체 + 외부 병행", description: "여러 채널과 병행" },
      { value: "external" as const, label: "헤드헌터 사용 중", description: "외부 채용 채널 활용 중" },
    ],
  },
] as const satisfies readonly SurveyQuestion<keyof SurveyAnswers>[];
