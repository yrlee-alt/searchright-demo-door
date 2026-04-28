import type { Metadata } from "next";
import { Suspense } from "react";
import AIRecruiterFlow from "./AIRecruiterFlow";

export const metadata: Metadata = {
  title: "AI 인재 검색 | SearchRight",
  robots: { index: false, follow: false },
};

export default function AIRecruiterPage() {
  return (
    <Suspense>
      <AIRecruiterFlow />
    </Suspense>
  );
}
