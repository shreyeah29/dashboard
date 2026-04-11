export type CompanyYearRevenue = {
  key: string;
  /** Calendar or fiscal year label, e.g. 2024 */
  year: number;
  /** Revenue in ₹ Crores */
  amountCr: number;
  note?: string;
};

const STORAGE_KEY = 'edicius_admin_company_revenue_v1';

type Slug = string;

function readAll(): Record<Slug, CompanyYearRevenue[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<Slug, CompanyYearRevenue[]>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<Slug, CompanyYearRevenue[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadCompanyRevenue(slug: string): CompanyYearRevenue[] {
  const all = readAll();
  const rows = all[slug] || [];
  return [...rows].sort((a, b) => b.year - a.year);
}

export function revenueYearCount(slug: string): number {
  return loadCompanyRevenue(slug).length;
}

export function addCompanyYearRevenue(
  slug: string,
  partial: Omit<CompanyYearRevenue, 'key'>
): CompanyYearRevenue {
  const rows = loadCompanyRevenue(slug);
  if (rows.some((r) => r.year === partial.year)) {
    throw new Error('DUPLICATE_YEAR');
  }
  const row: CompanyYearRevenue = {
    ...partial,
    key:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `rv-${slug}-${partial.year}-${Date.now()}`,
  };
  const all = readAll();
  all[slug] = [...rows, row].sort((a, b) => b.year - a.year);
  writeAll(all);
  return row;
}

export function updateCompanyYearRevenue(
  slug: string,
  key: string,
  next: { year: number; amountCr: number; note?: string }
): void {
  const rows = loadCompanyRevenue(slug);
  const idx = rows.findIndex((r) => r.key === key);
  if (idx === -1) return;
  if (rows.some((r, i) => i !== idx && r.year === next.year)) {
    throw new Error('DUPLICATE_YEAR');
  }
  rows[idx] = {
    ...rows[idx],
    year: next.year,
    amountCr: next.amountCr,
    note: next.note,
  };
  const all = readAll();
  all[slug] = rows.sort((a, b) => b.year - a.year);
  writeAll(all);
}

export function deleteCompanyYearRevenue(slug: string, key: string): void {
  const rows = loadCompanyRevenue(slug).filter((r) => r.key !== key);
  const all = readAll();
  if (rows.length === 0) delete all[slug];
  else all[slug] = rows;
  writeAll(all);
}

/** Clears all per-company yearly revenue saved in this browser. */
export function clearAllCompanyRevenueLocal(): void {
  localStorage.removeItem(STORAGE_KEY);
}
