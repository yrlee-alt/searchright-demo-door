export function trackEvent(name: string, path: string | null, params: Record<string, unknown> = {}): void {
  console.log(`[track] ${name}`, { path, ...params });
}
