export interface FakeCandidateCard {
  initials: string;
  title: string;
  detail: string;
  years: string;
}

export interface FakeCandidate {
  surname: string;
  display: string;
  title: string;
  fromCompany: string;
  toCompany: string;
  years: number;
  score: number;
}

const FIRST_NAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "전"];

const ROLES = [
  // 개발
  "시니어 백엔드 엔지니어",
  "프론트엔드 리드",
  "풀스택 개발자",
  "iOS 시니어 엔지니어",
  "Android 시니어 엔지니어",
  "데이터 엔지니어",
  "데이터 사이언티스트",
  "ML 엔지니어",
  "DevOps 엔지니어",
  "보안 엔지니어",
  "QA 리드",
  // 프로덕트·디자인
  "프로덕트 매니저",
  "시니어 PM",
  "프로덕트 디자이너",
  "디자인 리드",
  "UX 리서처",
  "브랜드 디자이너",
  // 마케팅·그로스
  "마케팅 리드",
  "그로스 매니저",
  "퍼포먼스 마케터",
  "콘텐츠 마케팅 매니저",
  "브랜드 마케터",
  "CRM 매니저",
  // 영업·BD
  "B2B 세일즈 리드",
  "엔터프라이즈 어카운트 매니저",
  "사업개발 매니저",
  "파트너십 매니저",
  // HR·운영
  "HR 비즈니스 파트너",
  "채용 매니저",
  "조직문화 리드",
  "재무 매니저",
  "FP&A 매니저",
  "법무 매니저",
  // 임원급
  "CTO",
  "VP of Engineering",
  "CPO",
  "CMO",
  "COO",
];

const COMPANIES = [
  // Tier 1 — 대기업·플랫폼
  "삼성전자", "SK텔레콤", "LG전자", "현대자동차", "CJ ENM",
  "카카오", "네이버", "라인", "쿠팡", "토스",
  // Tier 2 — 유니콘·시리즈
  "당근마켓", "배달의민족", "야놀자", "마켓컬리", "직방",
  "무신사", "29CM", "오늘의집", "리디", "원티드",
  "뱅크샐러드", "카카오뱅크", "케이뱅크", "토스뱅크",
  // Tier 3 — 게임·엔터·스타트업
  "넥슨", "엔씨소프트", "크래프톤", "펄어비스", "스마일게이트",
  "하이브", "SM엔터테인먼트", "JYP",
  "카페24", "더핑크퐁컴퍼니", "센드버드", "버킷플레이스",
  "스푼라디오", "피플펀드", "스파크플러스", "에이블리",
];

function seededRng(seed: number) {
  let s = seed === 0 ? 1 : seed;
  return () => {
    s = ((s * 1664525 + 1013904223) | 0) >>> 0;
    return s / 0xffffffff;
  };
}

function hashQuery(query: string): number {
  let h = 0;
  for (let i = 0; i < query.length; i++) {
    h = ((h << 5) - h + query.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Generates N plausible-looking but fake candidate rows, deterministic from query.
 * Score range: 78~99. Years range: 3~15. Each row has distinct surname pattern,
 * role, from/to company pair, years, and a matching score.
 */
export function generateFakeCandidateList(query: string, count: number): FakeCandidate[] {
  const rng = seededRng(hashQuery(query) + count);
  const results: FakeCandidate[] = [];

  for (let i = 0; i < count; i++) {
    const surname = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const role = ROLES[Math.floor(rng() * ROLES.length)];
    let from = COMPANIES[Math.floor(rng() * COMPANIES.length)];
    let to = COMPANIES[Math.floor(rng() * COMPANIES.length)];
    if (to === from) {
      to = COMPANIES[(COMPANIES.indexOf(from) + 1) % COMPANIES.length];
    }
    const years = 3 + Math.floor(rng() * 13); // 3~15
    // Score gradient: top candidates higher, tail lower; with jitter.
    const base = 99 - Math.floor((i / Math.max(count - 1, 1)) * 21); // 99 → 78 across the list
    const jitter = Math.floor(rng() * 3) - 1; // -1, 0, +1
    const score = Math.max(78, Math.min(99, base + jitter));

    results.push({
      surname,
      display: `${surname}○○`,
      title: role,
      fromCompany: from,
      toCompany: to,
      years,
      score,
    });
  }

  return results;
}

/**
 * Legacy: 3-card preview helper kept for backward compatibility.
 */
export function generateFakeCandidateCards(query: string): FakeCandidateCard[] {
  return generateFakeCandidateList(query, 3).map((c) => ({
    initials: c.display,
    title: c.title,
    detail: `전 ${c.fromCompany} → ${c.toCompany} · ${c.years}년차`,
    years: `${c.years}년차`,
  }));
}
