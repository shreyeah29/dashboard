/**
 * Team member directory is stored on the server (MongoDB). This module only
 * dispatches a browser event so the dashboard count stays in sync after changes.
 */

export function notifyTeamMembersChanged(): void {
  window.dispatchEvent(new CustomEvent('edicius-team-members-changed'));
}
