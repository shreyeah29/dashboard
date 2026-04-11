const PREFS_KEY = 'edicius_admin_preferences_v1';

export type AdminPreferences = {
  /** Auto-logout after this many minutes without activity */
  sessionTimeoutMinutes: number;
  /** Shown in the top bar instead of the default label when set */
  displayName?: string;
  /** Red dot on the notification bell */
  showBellIndicator: boolean;
};

const defaults: AdminPreferences = {
  sessionTimeoutMinutes: 60,
  showBellIndicator: true,
};

function clampSessionMinutes(n: number): number {
  if (!Number.isFinite(n)) return defaults.sessionTimeoutMinutes;
  return Math.min(480, Math.max(5, Math.round(n)));
}

export function loadAdminPreferences(): AdminPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...defaults };
    const p = JSON.parse(raw) as Partial<AdminPreferences>;
    return {
      sessionTimeoutMinutes: clampSessionMinutes(
        typeof p.sessionTimeoutMinutes === 'number' ? p.sessionTimeoutMinutes : defaults.sessionTimeoutMinutes
      ),
      displayName: typeof p.displayName === 'string' ? p.displayName : undefined,
      showBellIndicator: p.showBellIndicator !== false,
    };
  } catch {
    return { ...defaults };
  }
}

export function saveAdminPreferences(next: Partial<AdminPreferences>): AdminPreferences {
  const cur = loadAdminPreferences();
  const merged: AdminPreferences = {
    sessionTimeoutMinutes: clampSessionMinutes(
      next.sessionTimeoutMinutes !== undefined ? next.sessionTimeoutMinutes : cur.sessionTimeoutMinutes
    ),
    displayName:
      next.displayName !== undefined ? (next.displayName.trim() || undefined) : cur.displayName,
    showBellIndicator:
      next.showBellIndicator !== undefined ? next.showBellIndicator : cur.showBellIndicator,
  };
  localStorage.setItem(PREFS_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event('edicius-admin-prefs'));
  return merged;
}

export function resetAdminPreferences(): void {
  localStorage.removeItem(PREFS_KEY);
  window.dispatchEvent(new Event('edicius-admin-prefs'));
}

export function getSessionTimeoutMs(): number {
  return loadAdminPreferences().sessionTimeoutMinutes * 60 * 1000;
}
