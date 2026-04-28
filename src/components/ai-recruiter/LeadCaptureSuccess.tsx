"use client";

export default function LeadCaptureSuccess() {
  return (
    <div className="w-full rounded-2xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-white p-10 shadow-lg">
      <div className="flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-30" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h2 className="text-24 font-bold text-slate-900">발견했습니다 ✓</h2>
          <p className="mt-3 text-16 text-slate-600">
            요구사항을 더 구체화하기 위해 담당 컨설턴트가 곧 연락드릴 예정입니다.
          </p>
        </div>

        {/* Info card */}
        <div className="w-full rounded-lg bg-white p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-15 font-semibold text-slate-900">평균 24시간 이내 연락</span>
          </div>
        </div>
      </div>
    </div>
  );
}
