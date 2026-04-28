import type { Metadata } from "next";
import { Suspense } from "react";
import AIRecruiterFlow from "./ai-recruiter/AIRecruiterFlow";

export const metadata: Metadata = {
  title: "AI Recruiter | SearchRight",
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <Suspense>
      <AIRecruiterFlow />
    </Suspense>
  );
}
