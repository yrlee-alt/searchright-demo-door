export type Variant = "minimal" | "terminal" | "scanner";

export const DEFAULT_VARIANT: Variant = "terminal";

export function parseVariant(raw: string | null | undefined): Variant {
  if (raw === "terminal" || raw === "scanner" || raw === "minimal") {
    return raw;
  }
  return DEFAULT_VARIANT;
}
