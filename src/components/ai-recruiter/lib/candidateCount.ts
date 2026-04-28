/**
 * Deterministic candidate count from query string.
 * Same query always produces the same number — prevents "refresh shows different count" weirdness.
 * Range: 12 ~ 48.
 */
export function candidateCountFromQuery(query: string): number {
  let h = 0;
  for (let i = 0; i < query.length; i++) {
    h = ((h << 5) - h + query.charCodeAt(i)) | 0;
  }
  return 12 + (Math.abs(h) % 37);
}
