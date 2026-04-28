export interface SourceChip {
  key: string;
  label: string;
  monogram: string;
  bgColor: string;
  textColor: string;
}

/**
 * The 5 talent source platforms displayed in animations.
 * Using monogram chips (brand-safe, no external logo fetch needed).
 */
export const SOURCES: SourceChip[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    monogram: "Li",
    bgColor: "#0077B5",
    textColor: "#ffffff",
  },
  {
    key: "wanted",
    label: "원티드",
    monogram: "원",
    bgColor: "#36f",
    textColor: "#ffffff",
  },
  {
    key: "saramin",
    label: "사람인",
    monogram: "사",
    bgColor: "#e8380d",
    textColor: "#ffffff",
  },
  {
    key: "jobkorea",
    label: "잡코리아",
    monogram: "잡",
    bgColor: "#ff6b35",
    textColor: "#ffffff",
  },
  {
    key: "rocketpunch",
    label: "로켓펀치",
    monogram: "로",
    bgColor: "#e74c3c",
    textColor: "#ffffff",
  },
];
