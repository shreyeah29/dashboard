export type TeamMember = {
  /** Stable row key (UUID) */
  key: string;
  /** Human-readable employee ID shown in the directory */
  employeeId: string;
  name: string;
  designation: string;
  region: string;
  /** Office or site name (where they work) */
  place: string;
};

/** Exported so the Team members page can listen for cross-tab updates. */
export const TEAM_MEMBERS_STORAGE_KEY = 'edicius_admin_team_members_v1';
const STORAGE_KEY = TEAM_MEMBERS_STORAGE_KEY;

function parseEmployeeNumber(id: string): number {
  const m = /^ED-(\d+)$/i.exec(id.trim());
  return m ? parseInt(m[1], 10) : 0;
}

function nextEmployeeId(members: TeamMember[]): string {
  const max = members.reduce((acc, m) => Math.max(acc, parseEmployeeNumber(m.employeeId)), 1000);
  return `ED-${max + 1}`;
}

export function loadTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TeamMember[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    return parsed.map((m) => ({
      ...m,
      key: m.key || `legacy-${m.employeeId}-${Math.random().toString(36).slice(2, 9)}`,
    }));
  } catch {
    return [];
  }
}

function notifyTeamMembersChanged(): void {
  window.dispatchEvent(new CustomEvent('edicius-team-members-changed'));
}

export function saveTeamMembers(members: TeamMember[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  notifyTeamMembersChanged();
}

export function countTeamMembers(): number {
  return loadTeamMembers().length;
}

export function addTeamMember(partial: {
  employeeId?: string;
  name: string;
  designation: string;
  region: string;
  place: string;
}): TeamMember {
  const members = loadTeamMembers();
  const employeeId = partial.employeeId?.trim() || nextEmployeeId(members);
  const row: TeamMember = {
    key: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `new-${Date.now()}`,
    employeeId,
    name: partial.name.trim(),
    designation: partial.designation.trim(),
    region: partial.region.trim(),
    place: partial.place.trim(),
  };
  members.push(row);
  saveTeamMembers(members);
  return row;
}

export function updateTeamMember(key: string, updates: Partial<Omit<TeamMember, 'key'>>): void {
  const members = loadTeamMembers();
  const i = members.findIndex((m) => m.key === key);
  if (i === -1) return;
  const cur = members[i];
  members[i] = {
    ...cur,
    ...updates,
    key: cur.key,
    employeeId: (updates.employeeId ?? cur.employeeId).trim(),
    name: (updates.name ?? cur.name).trim(),
    designation: (updates.designation ?? cur.designation).trim(),
    region: (updates.region ?? cur.region).trim(),
    place: (updates.place ?? cur.place).trim(),
  };
  saveTeamMembers(members);
}

export function deleteTeamMember(key: string): void {
  const members = loadTeamMembers().filter((m) => m.key !== key);
  saveTeamMembers(members);
}

export function uniqueRegions(members: TeamMember[]): string[] {
  return [...new Set(members.map((m) => m.region))].sort();
}

export function placesWithCounts(members: TeamMember[]): { place: string; region: string; count: number }[] {
  const map = new Map<string, { place: string; region: string; count: number }>();
  for (const m of members) {
    const k = `${m.region}::${m.place}`;
    const prev = map.get(k);
    if (prev) prev.count += 1;
    else map.set(k, { place: m.place, region: m.region, count: 1 });
  }
  return [...map.values()].sort((a, b) => a.place.localeCompare(b.place));
}

/** Removes saved team directory data from this browser (directory is empty until you add again). */
export function clearTeamMembersLocalData(): void {
  localStorage.removeItem(STORAGE_KEY);
  notifyTeamMembersChanged();
}
