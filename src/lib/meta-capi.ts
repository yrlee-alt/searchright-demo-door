export interface CAPIEventInput {
  event_name: string;
  event_id: string;
  event_source_url: string;
  user_data?: Record<string, unknown>;
  custom_data?: Record<string, unknown>;
}

export function sendCAPIEvent(input: CAPIEventInput): void {
  console.log("[meta-capi]", input);
}
