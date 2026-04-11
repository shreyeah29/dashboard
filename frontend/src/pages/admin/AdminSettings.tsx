import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Clock,
  Database,
  LogOut,
  Server,
  Settings2,
  Shield,
  User,
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
import { clearTeamMembersLocalData } from '@/lib/teamMembersStore';
import { DASHBOARD_API_PUBLIC_BASE } from '@/lib/api';

const SESSION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
] as const;

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<AdminPreferences>(() => loadAdminPreferences());
  const [displayNameDraft, setDisplayNameDraft] = useState('');
  const [sessionDraft, setSessionDraft] = useState(60);

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

  const handleClearTeam = () => {
    if (!window.confirm('Remove all team member directory data from this browser? The list will be empty until you add people again.')) return;
    clearTeamMembersLocalData();
    toast({ title: 'Cleared', description: 'Team member local data was removed.' });
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
                Workspace preferences, session behaviour, and local data for this browser.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
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
              <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm text-gray-600">
                <span className="font-medium text-gray-800">Admin ID: </span>
                {user?.id || '—'}
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
                Browser-only data
              </CardTitle>
              <CardDescription>
                Team members and revenue figures you entered are stored in this browser until you clear them or
                use a different device.
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
            <CardContent className="text-sm text-gray-600 space-y-1">
              <p>Version 1.0.0</p>
              <p>Use the sidebar to manage companies, units, documents, revenue, and team data.</p>
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
