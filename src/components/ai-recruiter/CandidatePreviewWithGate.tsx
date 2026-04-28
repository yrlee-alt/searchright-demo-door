"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/api";
import { sendCAPIEvent } from "@/lib/meta-capi";
import { trackEvent } from "@/utils/analytics";
import { generateFakeCandidateCards } from "./lib/fakeCandidateCards";
import LeadCaptureSuccess from "./LeadCaptureSuccess";
import type { Variant } from "./lib/variants";

interface CandidatePreviewWithGateProps {
  query: string;
  candidateCount: number;
  variant: Variant;
}

interface LeadFormState {
  personName: string;
  email: string;
  companyName: string;
}

interface LeadFormErrors {
  personName: string;
  email: string;
  companyName: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CandidatePreviewWithGate({ query, candidateCount, variant }: CandidatePreviewWithGateProps) {
  const path = usePathname();
  const cards = generateFakeCandidateCards(query);
  const displayQuery = query.length > 100 ? query.slice(0, 100) + "..." : query;

  const [form, setForm] = useState<LeadFormState>({ personName: "", email: "", companyName: "" });
  const [touched, setTouched] = useState<Record<keyof LeadFormState, boolean>>({
    personName: false,
    email: false,
    companyName: false,
  });
  const [errors, setErrors] = useState<LeadFormErrors>({ personName: "", email: "", companyName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);

  function validateField(field: keyof LeadFormState, value: string): string {
    switch (field) {
      case "personName":
        return value.trim() === "" ? "성함을 입력해주세요" : "";
      case "email":
        if (!value.trim()) return "이메일을 입력해주세요";
        return validateEmail(value) ? "" : "올바른 이메일 형식이 아닙니다";
      case "companyName":
        return value.trim() === "" ? "회사명을 입력해주세요" : "";
    }
  }

  function handleChange(field: keyof LeadFormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear error on change if touched
      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
      }
    };
  }

  function handleBlur(field: keyof LeadFormState) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, form[field]) }));
    };
  }

  function handleFocus(fieldLabel: string) {
    if (!hasTrackedFormStart) {
      setHasTrackedFormStart(true);
      trackEvent("ai_recruiter_form_start", path, { variant, first_field: fieldLabel });
    }
  }

  const isFormValid =
    !validateField("personName", form.personName) &&
    !validateField("email", form.email) &&
    !validateField("companyName", form.companyName);

  async function handleSubmit() {
    // Touch all fields
    const allTouched = { personName: true, email: true, companyName: true };
    setTouched(allTouched);
    const newErrors: LeadFormErrors = {
      personName: validateField("personName", form.personName),
      email: validateField("email", form.email),
      companyName: validateField("companyName", form.companyName),
    };
    setErrors(newErrors);
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const requestData = {
        personName: form.personName,
        email: form.email,
        // API postRequestList does not have a dedicated companyName field;
        // fold company + query into the text field so sales team can parse it.
        text: `회사: ${form.companyName} / 검색쿼리: ${query}`,
        // contactNumber is required by the API type — pass empty string.
        // TODO: backend team may want to add companyName as a top-level field.
        contactNumber: "",
        source: "ai-recruiter",
      };

      const res = await api.user.postRequestList(requestData);

      trackEvent("generate_lead", path, { inquiry_type: "ai_recruiter" });

      const leadEventId = crypto.randomUUID();
      window.fbq?.("track", "Lead", {}, { eventID: leadEventId });

      const name = form.personName.trim();
      const ln = name.length > 0 ? name[0] : undefined;
      const fn = name.length > 1 ? name.slice(1) : undefined;
      const externalId = res.success ? String(res.data.id) : undefined;

      sendCAPIEvent({
        event_name: "Lead",
        event_id: leadEventId,
        event_source_url: window.location.href,
        user_data: {
          em: form.email,
          fn,
          ln,
          external_id: externalId,
        },
        custom_data: { content_name: "ai_recruiter" },
      });

      toast.success("후보자 리스트 요청이 성공적으로 전송되었습니다!");
      setIsSuccess(true);
    } catch (error) {
      console.error("AI recruiter form submission error:", error);
      toast.error("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 pb-16">
        <LeadCaptureSuccess />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16">
      {/* Headline */}
      <div className="mb-2 text-center">
        <h1 className="text-28 font-bold text-slate-900 tablet:text-36">
          AI가 <span className="text-sky-600">{candidateCount}명</span>의 매칭 후보를 발견했습니다
        </h1>
        <p className="mt-2 text-14 text-slate-500">검색 쿼리: {displayQuery}</p>
      </div>

      {/* Blurred candidate cards */}
      <div className="mb-8 mt-6 grid grid-cols-1 gap-4 tablet:grid-cols-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            {/* Lock badge */}
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-11 font-medium text-slate-500">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              컨택 후 공개
            </div>

            {/* Avatar placeholder */}
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-14 font-bold text-slate-600">
              {card.initials.slice(0, 1)}
            </div>

            {/* Blurred content */}
            <div className="select-none">
              <p className="blur-sm text-15 font-semibold text-slate-800">{card.initials}</p>
              <p className="blur-sm text-13 text-slate-600">{card.title}</p>
              <p className="mt-1 blur-sm text-12 text-slate-400">{card.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lead capture form */}
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg tablet:p-8">
        <h2 className="mb-1 text-18 font-semibold text-slate-900">
          발견된 {candidateCount}명 후보 받기
        </h2>
        <p className="mb-5 text-13 text-slate-500">정보를 입력하시면 담당 컨설턴트가 연락드립니다.</p>

        <div className="space-y-4">
          {/* 성함 */}
          <div>
            <label className="mb-2 block text-14 font-medium text-slate-700">
              성함 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="이름 혹은 업체명"
              value={form.personName}
              onChange={handleChange("personName")}
              onFocus={() => handleFocus("성함")}
              onBlur={handleBlur("personName")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 tablet:px-4 tablet:py-3"
            />
            {touched.personName && errors.personName && (
              <p className="mt-1 text-12 text-red-600">{errors.personName}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="mb-2 block text-14 font-medium text-slate-700">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="ex@company.com"
              value={form.email}
              onChange={handleChange("email")}
              onFocus={() => handleFocus("이메일")}
              onBlur={handleBlur("email")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 tablet:px-4 tablet:py-3"
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-12 text-red-600">{errors.email}</p>
            )}
          </div>

          {/* 회사명 */}
          <div>
            <label className="mb-2 block text-14 font-medium text-slate-700">
              회사명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="회사명을 입력해주세요"
              value={form.companyName}
              onChange={handleChange("companyName")}
              onFocus={() => handleFocus("회사명")}
              onBlur={handleBlur("companyName")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 tablet:px-4 tablet:py-3"
            />
            {touched.companyName && errors.companyName && (
              <p className="mt-1 text-12 text-red-600">{errors.companyName}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-lg bg-sky-600 px-6 py-3.5 text-16 font-semibold text-white shadow-md transition-all duration-200 hover:bg-sky-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  요청 중...
                </span>
              ) : (
                `발견된 ${candidateCount}명 후보 받기`
              )}
            </button>
            <p className="mt-2 text-center text-12 text-slate-400">
              제출 시{" "}
              <Link
                href="https://searchright.notion.site/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-sky-600"
              >
                개인정보 처리방침
              </Link>
              에 동의한 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
