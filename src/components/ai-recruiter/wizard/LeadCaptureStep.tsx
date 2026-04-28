"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/api";
import { sendCAPIEvent } from "@/lib/meta-capi";
import { trackEvent } from "@/utils/analytics";
import { candidateCountFromQuery } from "../lib/candidateCount";
import { SURVEY_QUESTIONS } from "./surveyQuestions";
import { useWizardStore } from "./wizardStore";

function validateKoreanPhone(value: string): boolean {
  // Accept 010-XXXX-XXXX, 010 XXXX XXXX, or 010XXXXXXXX (and 011/016-019)
  const digits = value.replace(/[^0-9]/g, "");
  return /^01[016789]\d{7,8}$/.test(digits);
}

function formatKoreanPhone(value: string): string {
  const digits = value.replace(/[^0-9]/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

type FieldKey = "personName" | "phone" | "companyName";

function getLabelOf(
  questionKey: keyof ReturnType<typeof useWizardStore.getState>["survey"],
  value: string | undefined,
): string {
  if (!value) return "미응답";
  const q = SURVEY_QUESTIONS.find((q) => q.key === questionKey);
  if (!q) return value;
  const opt = q.options.find((o) => o.value === value);
  return opt ? opt.label : value;
}

export default function LeadCaptureStep() {
  const path = usePathname();
  const { query, variant, jdUrl, jdSkipped, survey, contact, setContact, setCandidateCount, goTo } =
    useWizardStore();

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    personName: false,
    phone: false,
    companyName: false,
  });
  const [errors, setErrors] = useState<Record<FieldKey, string>>({
    personName: "",
    phone: "",
    companyName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);

  function validateField(field: FieldKey, value: string): string {
    switch (field) {
      case "personName":
        return value.trim() === "" ? "성함을 입력해주세요" : "";
      case "phone":
        if (!value.trim()) return "전화번호를 입력해주세요";
        return validateKoreanPhone(value)
          ? ""
          : "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)";
      case "companyName":
        return value.trim() === "" ? "회사명을 입력해주세요" : "";
    }
  }

  function handleChange(field: FieldKey) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "phone") value = formatKoreanPhone(value);
      setContact({ [field]: value });
      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
      }
    };
  }

  function handleBlur(field: FieldKey) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, contact[field]) }));
    };
  }

  function handleFocus(fieldLabel: string) {
    if (!hasTrackedFormStart) {
      setHasTrackedFormStart(true);
      trackEvent("ai_recruiter_form_start", path, { variant, first_field: fieldLabel });
    }
  }

  const isFormValid =
    !validateField("personName", contact.personName) &&
    !validateField("phone", contact.phone) &&
    !validateField("companyName", contact.companyName);

  async function handleSubmit() {
    const allTouched: Record<FieldKey, boolean> = {
      personName: true,
      phone: true,
      companyName: true,
    };
    setTouched(allTouched);
    const newErrors: Record<FieldKey, string> = {
      personName: validateField("personName", contact.personName),
      phone: validateField("phone", contact.phone),
      companyName: validateField("companyName", contact.companyName),
    };
    setErrors(newErrors);
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const structuredText = [
        `검색쿼리: ${query}`,
        `JD: ${jdSkipped ? "미제공" : jdUrl}`,
        `시급도: ${getLabelOf("urgency", survey.urgency)}`,
        `채용 규모: ${getLabelOf("headcount", survey.headcount)}`,
        `회사 단계: ${getLabelOf("companyStage", survey.companyStage)}`,
        `진행 상황: ${getLabelOf("progressStatus", survey.progressStatus)}`,
        `회사: ${contact.companyName}`,
      ].join(" / ");

      const res = await api.user.postRequestList({
        personName: contact.personName,
        email: "",
        text: structuredText,
        contactNumber: contact.phone,
        source: "ai-recruiter-phone",
      });

      trackEvent("generate_lead", path, { inquiry_type: "ai_recruiter_phone", content_name: "ai_recruiter_phone" });

      const leadEventId = crypto.randomUUID();
      window.fbq?.("track", "Lead", {}, { eventID: leadEventId });

      const name = contact.personName.trim();
      const ln = name.length > 0 ? name[0] : undefined;
      const fn = name.length > 1 ? name.slice(1) : undefined;
      const externalId = res.success ? String(res.data.id) : undefined;

      sendCAPIEvent({
        event_name: "Lead",
        event_id: leadEventId,
        event_source_url: window.location.href,
        user_data: { ph: contact.phone.replace(/[^0-9]/g, ""), fn, ln, external_id: externalId },
        custom_data: { content_name: "ai_recruiter_phone" },
      });

      const count = candidateCountFromQuery(query);
      setCandidateCount(count);
      goTo("result");
    } catch (error) {
      console.error("AI recruiter lead capture error:", error);
      toast.error("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: "var(--radius-md)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-surface)",
    padding: "16px 20px",
    fontSize: "16px",
    color: "var(--color-fg)",
    minHeight: "56px",
    outline: "none",
    transition: "all 0.2s",
  };

  function inputFocusStyle(field: FieldKey): React.CSSProperties {
    const hasErr = touched[field] && errors[field];
    return {
      ...inputBase,
      borderColor: hasErr ? "var(--color-danger)" : "var(--color-accent)",
      boxShadow: hasErr
        ? "0 0 0 4px rgba(255,59,48,0.12)"
        : "0 0 0 4px var(--color-accent-soft)",
    };
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-8 tablet:py-12">
      {/* Headline */}
      <div className="mb-10 text-center">
        <h1
          className="font-bold tracking-tight text-[var(--color-fg)]"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.07,
            letterSpacing: "-0.022em",
          }}
        >
          결과를 어디로 보내드릴까요?
        </h1>
        <p className="mt-4 text-16 text-[var(--color-fg-muted)]">
          매칭 결과 정리 후 24시간 내 담당 서치라이트 매니저가 직접 연락드립니다.
        </p>
      </div>

      {/* Form card */}
      <div
        className="mx-auto w-full"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-soft)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          padding: "32px",
        }}
      >
        <div className="flex flex-col gap-5">
          {/* 성함 */}
          <div>
            <label
              className="mb-2 block text-14 font-medium"
              style={{ color: "var(--color-fg)" }}
            >
              성함 <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="홍길동"
              value={contact.personName}
              onChange={handleChange("personName")}
              onFocus={() => handleFocus("성함")}
              onBlur={handleBlur("personName")}
              style={inputBase}
              onFocusCapture={(e) => {
                Object.assign(e.currentTarget.style, inputFocusStyle("personName"));
              }}
              onBlurCapture={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...inputBase,
                  borderColor: touched.personName && errors.personName
                    ? "var(--color-danger)"
                    : "var(--color-border)",
                  boxShadow: "none",
                });
              }}
            />
            {touched.personName && errors.personName && (
              <p className="mt-1.5 text-13" style={{ color: "var(--color-danger)" }}>
                {errors.personName}
              </p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label
              className="mb-2 block text-14 font-medium"
              style={{ color: "var(--color-fg)" }}
            >
              전화번호 <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="010-1234-5678"
              value={contact.phone}
              onChange={handleChange("phone")}
              onFocus={() => handleFocus("전화번호")}
              onBlur={handleBlur("phone")}
              style={inputBase}
              onFocusCapture={(e) => {
                Object.assign(e.currentTarget.style, inputFocusStyle("phone"));
              }}
              onBlurCapture={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...inputBase,
                  borderColor: touched.phone && errors.phone
                    ? "var(--color-danger)"
                    : "var(--color-border)",
                  boxShadow: "none",
                });
              }}
            />
            {touched.phone && errors.phone && (
              <p className="mt-1.5 text-13" style={{ color: "var(--color-danger)" }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* 회사명 */}
          <div>
            <label
              className="mb-2 block text-14 font-medium"
              style={{ color: "var(--color-fg)" }}
            >
              회사명 <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="서치라이트 주식회사"
              value={contact.companyName}
              onChange={handleChange("companyName")}
              onFocus={() => handleFocus("회사명")}
              onBlur={handleBlur("companyName")}
              style={inputBase}
              onFocusCapture={(e) => {
                Object.assign(e.currentTarget.style, inputFocusStyle("companyName"));
              }}
              onBlurCapture={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...inputBase,
                  borderColor: touched.companyName && errors.companyName
                    ? "var(--color-danger)"
                    : "var(--color-border)",
                  boxShadow: "none",
                });
              }}
            />
            {touched.companyName && errors.companyName && (
              <p className="mt-1.5 text-13" style={{ color: "var(--color-danger)" }}>
                {errors.companyName}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full font-semibold text-white transition-all duration-300 focus-visible:outline-none"
              style={{
                borderRadius: "9999px",
                backgroundColor: isSubmitting ? "var(--color-border)" : "var(--color-accent)",
                padding: "14px 28px",
                fontSize: "15px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-accent-pressed)";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-accent)";
              }}
              onMouseDown={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  요청 중...
                </span>
              ) : (
                "발견된 후보 받기"
              )}
            </button>

            <p className="mt-3 text-center text-12 text-[var(--color-fg-subtle)]">
              제출 시{" "}
              <Link
                href="https://searchright.notion.site/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-accent)]"
              >
                개인정보 처리방침
              </Link>
              에 동의한 것으로 간주됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
