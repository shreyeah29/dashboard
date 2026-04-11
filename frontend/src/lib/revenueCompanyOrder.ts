/**
 * Canonical display order for companies on the admin Revenue page.
 * Names are matched case-insensitively after normalizing whitespace.
 */
export const REVENUE_COMPANY_DISPLAY_ORDER: readonly string[] = [
  'Edicius Enterprises Private Limited',
  'Edicius Imports and Exports Private Limited',
  'Edicius Innovations and Consulting Private Limited',
  'Edicius Infrastructure and Developers Private Limited',
  'Edicius Consumer Products Private Limited',
  'Edicius Productions and Entertainment Private Limited',
  'Edicius Hotels and Hospitality Private Limited',
  'Edicius Mining and Minerals Private Limited',
] as const;

function normalizeCompanyName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Sort API companies: preferred revenue order first, then any others A–Z. */
export function sortCompaniesByRevenueDisplayOrder<T extends { name: string }>(companies: T[]): T[] {
  const orderIndex = new Map(
    REVENUE_COMPANY_DISPLAY_ORDER.map((n, i) => [normalizeCompanyName(n), i])
  );
  return [...companies].sort((a, b) => {
    const ia = orderIndex.get(normalizeCompanyName(a.name));
    const ib = orderIndex.get(normalizeCompanyName(b.name));
    if (ia !== undefined && ib !== undefined) return ia - ib;
    if (ia !== undefined) return -1;
    if (ib !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });
}
