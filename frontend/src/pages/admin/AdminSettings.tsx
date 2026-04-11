import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Building2,
  Clock,
  Database,
  FileText,
  Layers,
  Landmark,
  LogOut,
  RefreshCw,
  Server,
  Settings2,
  Shield,
  User,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  loadAdminPreferences,
  resetAdminPreferences,
  saveAdminPreferences,
  type AdminPreferences,
} from '@/lib/adminPreferences';
import { clearAllCompanyRevenueLocal } from '@/lib/companyRevenueStore';
import { companiesApi, documentsApi, DASHBOARD_API_PUBLIC_BASE, projectsApi, teamMembersApi } from '@/lib/api';
import { notifyTeamMembersChanged } from '@/lib/teamMembersStore';

const SESSION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
] as const;

type OverviewStats = {
  companies: number | null;
  units: number | null;
  teamMembers: number | null;
  documents: number | null;
};

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<AdminPreferences>(() => loadAdminPreferences());
  const [displayNameDraft, setDisplayNameDraft] = useState('');
  const [sessionDraft, setSessionDraft] = useState(60);
  const [overview, setOverview] = useState<OverviewStats>({
    companies: null,
    units: null,
    teamMembers: null,
    documents: null,
  });
  const [overviewLoading, setOverviewLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    const next: OverviewStats = {
      companies: null,
      units: null,
      teamMembers: null,
      documents: null,
    };
    try {
      const companies = await companiesApi.getAll();
      next.companies = companies.length;
    } catch {
      next.companies = null;
    }
    try {
      const units = await projectsApi.getAllUnits();
      next.units = units.length;
    } catch {
      next.units = null;
    }
    try {
      const docs = await documentsApi.getAll();
      next.documents = docs.length;
    } catch {
      next.documents = null;
    }
    try {
      const team = await teamMembersApi.getAll();
      next.teamMembers = team.length;
    } catch {
      next.teamMembers = null;
    }
    setOverview(next);
    setOverviewLoading(false);
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    const p = loadAdminPreferences();
    setPrefs(p);
    setDisplayNameDraft(p.displayName || '');
    setSessionDraft(p.sessionTimeoutMinutes);
  }, []);

  const syncFromStorage = () => {
    const p = loadAdminPreferences();
    setPrefs(p);
    setDisplayNameDraft(p.displayName || '');
    setSessionDraft(p.sessionTimeoutMinutes);
  };

  useEffect(() => {
    const onPrefs = () => syncFromStorage();
    window.addEventListener('edicius-admin-prefs', onPrefs);
    return () => window.removeEventListener('edicius-admin-prefs', onPrefs);
  }, []);

  const handleSaveWorkspace = () => {
    saveAdminPreferences({
      displayName: displayNameDraft,
      sessionTimeoutMinutes: sessionDraft,
    });
    syncFromStorage();
    toast({
      title: 'Saved',
      description: 'Workspace name and session timeout updated.',
    });
  };

  const handleBellToggle = (checked: boolean) => {
    saveAdminPreferences({ showBellIndicator: checked });
    setPrefs(loadAdminPreferences());
    toast({ title: 'Saved', description: checked ? 'Bell indicator on.' : 'Bell indicator hidden.' });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Logged out', description: 'You have been signed out.' });
      navigate('/');
    } catch {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
  };

  const handleClearTeam = async () => {
    if (
      !window.confirm(
        'Remove every team member from the shared directory? This affects all admins and cannot be undone except by re-adding people.'
      )
    )
      return;
    try {
      await teamMembersApi.deleteAll();
      notifyTeamMembersChanged();
      await loadOverview();
      toast({ title: 'Cleared', description: 'Team directory was emptied on the server.' });
    } catch {
      toast({ title: 'Could not clear', description: 'Sign in as admin and try again.', variant: 'destructive' });
    }
  };

  const handleClearRevenue = () => {
    if (!window.confirm('Remove all revenue-by-year entries saved in this browser?')) return;
    clearAllCompanyRevenueLocal();
    toast({ title: 'Cleared', description: 'Revenue local data was removed.' });
  };

  const handleResetPrefs = () => {
    if (!window.confirm('Reset workspace settings (display name, session time, bell) to defaults?')) return;
    resetAdminPreferences();
    syncFromStorage();
    toast({ title: 'Reset', description: 'Preferences restored to defaults.' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
              <Settings2 className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black font-serif tracking-wide">Settings</h1>
              <p className="text-gray-600 mt-1 font-medium">
                Live counts from the API, your display preferences (this browser), and data tools for admins.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Workspace overview</CardTitle>
                <CardDescription>Current totals from the dashboard API (refreshes when you clear data).</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadOverview()}
                disabled={overviewLoading}
                className="shrink-0"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${overviewLoading ? 'animate-spin' : ''}`} />
                Refresh stats
              </Button>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <p className="text-sm text-gray-500">Loading statistics…</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Companies', value: overview.companies, icon: Building2, href: '/admin/companies' },
                    { label: 'Units', value: overview.units, icon: Layers, href: '/admin/companies' },
                    { label: 'Team', value: overview.teamMembers, icon: Users, href: '/admin/team-members' },
                    { label: 'Documents', value: overview.documents, icon: FileText, href: '/admin/documents' },
                  ].map((row) => (
                    <Link
                      key={row.label}
                      to={row.href}
                      className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 hover:border-gray-400 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                        <row.icon className="w-3.5 h-3.5" />
                        {row.label}
                      </div>
                      <p className="text-2xl font-bold text-black tabular-nums">
                        {row.value === null ? '—' : row.value}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link to="/admin/revenue">
                    <Landmark className="w-4 h-4 mr-1" />
                    Revenue
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/admin/team-members">Team members</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/admin/documents">Documents</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Workspace profile
              </CardTitle>
              <CardDescription>
                How your name appears in the top bar. Does not change your server login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="display-name">Display name</Label>
                <Input
                  id="display-name"
                  value={displayNameDraft}
                  onChange={(e) => setDisplayNameDraft(e.target.value)}
                  placeholder="e.g. Finance Admin"
                  maxLength={80}
                />
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-gray-800">Admin ID: </span>
                  {user?.id || '—'}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Role: </span>
                  Administrator
                </p>
                <p className="text-xs text-gray-500 pt-1 border-t border-gray-200 mt-2">
                  Saved display name:{' '}
                  <span className="font-medium text-gray-700">
                    {prefs.displayName?.trim() || 'Default (Admin User)'}
                  </span>
                  {' · '}
                  Auto-logout after{' '}
                  <span className="font-medium text-gray-700">{prefs.sessionTimeoutMinutes} min</span> idle
                  {' · '}
                  Bell dot: {prefs.showBellIndicator ? 'on' : 'off'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={prefs.showBellIndicator}
                    onChange={(e) => handleBellToggle(e.target.checked)}
                  />
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <Bell className="w-4 h-4 text-gray-500" />
                    Show red dot on notification bell
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Session & security
              </CardTitle>
              <CardDescription>
                You are signed out automatically after a period without mouse, keyboard, or touch activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="session-timeout">Inactivity timeout</Label>
                <select
                  id="session-timeout"
                  className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={sessionDraft}
                  onChange={(e) => setSessionDraft(Number(e.target.value))}
                >
                  {SESSION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                Shorter timeouts reduce risk if you leave the dashboard open on a shared computer.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" onClick={handleSaveWorkspace} className="bg-black text-white hover:bg-gray-800">
              Save workspace & session
            </Button>
          </div>

          <Card className="border border-amber-100 shadow-sm bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                <Database className="w-5 h-5" />
                Data management
              </CardTitle>
              <CardDescription>
                Team members are stored on the server (shared by all admins). Clearing the directory removes
                everyone for every device. Revenue amounts below are stored only in this browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button type="button" variant="outline" className="w-full sm:w-auto border-gray-300" onClick={handleClearTeam}>
                Clear team member directory
              </Button>
              <Button type="button" variant="outline" className="w-full sm:w-auto border-gray-300" onClick={handleClearRevenue}>
                Clear all revenue entries
              </Button>
              <Button type="button" variant="outline" className="w-full sm:w-auto border-amber-200 text-amber-900" onClick={handleResetPrefs}>
                Reset settings to defaults
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="w-5 h-5" />
                API connection
              </CardTitle>
              <CardDescription>This build uses the following dashboard API base URL.</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="block text-xs sm:text-sm break-all rounded-lg bg-gray-100 border border-gray-200 px-3 py-2 text-gray-800">
                {DASHBOARD_API_PUBLIC_BASE}
              </code>
              {import.meta.env.VITE_API_URL && (
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">VITE_API_URL</span> is set in this environment; the client may still
                  override in code—confirm with your deployment docs.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
              <CardDescription>Edicius admin portal (frontend)</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-medium text-gray-800">Portal:</span> Edicius Group admin (frontend v1.0.0)
              </p>
              <p className="text-xs leading-relaxed">
                Companies and units are stored in MongoDB. Team members are stored in MongoDB after the latest
                deploy. Revenue and some display options stay in this browser only unless you add more server
                features later.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="pt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-800"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out of admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
