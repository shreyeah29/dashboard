import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Pencil, Plus, Trash2, Users, Globe2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  addTeamMember,
  deleteTeamMember,
  loadTeamMembers,
  placesWithCounts,
  type TeamMember,
  uniqueRegions,
  updateTeamMember,
} from '@/lib/teamMembersStore';

const emptyForm = {
  employeeId: '',
  name: '',
  designation: '',
  region: '',
  place: '',
};

const AdminTeamMembers = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>(() => loadTeamMembers());
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [placeFilter, setPlaceFilter] = useState<{ region: string; place: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);

  const refresh = useCallback(() => {
    setMembers(loadTeamMembers());
  }, []);

  const regions = useMemo(() => uniqueRegions(members), [members]);
  const placeSummaries = useMemo(() => placesWithCounts(members), [members]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (regionFilter && m.region !== regionFilter) return false;
      if (placeFilter && (m.region !== placeFilter.region || m.place !== placeFilter.place)) return false;
      return true;
    });
  }, [members, regionFilter, placeFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      region: regionFilter || '',
      place: placeFilter?.place || '',
    });
    setDialogOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      employeeId: m.employeeId,
      name: m.name,
      designation: m.designation,
      region: m.region,
      place: m.place,
    });
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.designation.trim() || !form.region.trim() || !form.place.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in name, designation, region, and place.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editing) {
        updateTeamMember(editing.key, {
          employeeId: form.employeeId.trim() || editing.employeeId,
          name: form.name,
          designation: form.designation,
          region: form.region,
          place: form.place,
        });
        toast({ title: 'Saved', description: `${form.name} was updated.` });
      } else {
        addTeamMember({
          employeeId: form.employeeId.trim() || undefined,
          name: form.name,
          designation: form.designation,
          region: form.region,
          place: form.place,
        });
        toast({ title: 'Added', description: `${form.name} was added to the directory.` });
      }
      refresh();
      setDialogOpen(false);
    } catch {
      toast({
        title: 'Could not save',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const selectRegion = (r: string | null) => {
    setRegionFilter(r);
    setPlaceFilter(null);
  };

  const selectPlace = (region: string, place: string) => {
    setRegionFilter(region);
    setPlaceFilter({ region, place });
  };

  const clearFilters = () => {
    setRegionFilter(null);
    setPlaceFilter(null);
  };

  const filterActive = regionFilter !== null || placeFilter !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-black font-serif tracking-wide">Team members</h1>
            <p className="text-gray-600 mt-1 font-medium">
              Add people, then filter by region or office. Edit or remove rows from the directory below.
            </p>
          </div>
          <Button onClick={openAdd} className="bg-black text-white hover:bg-gray-800 shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add team member
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2 font-semibold text-black">
                  <Globe2 className="w-5 h-5" />
                  Regions
                </CardTitle>
                {filterActive && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-600">
                    <X className="w-4 h-4 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectRegion(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    regionFilter === null && placeFilter === null
                      ? 'bg-gray-100 border-black text-black'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  All regions
                  <span className="ml-2 text-gray-500">({members.length})</span>
                </button>
                {regions.map((r) => {
                  const count = members.filter((m) => m.region === r).length;
                  const active = regionFilter === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => selectRegion(r)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        active ? 'bg-gray-100 border-black text-black' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {r}
                      <span className="ml-2 text-gray-500">({count})</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 font-semibold text-black">
                <Users className="w-5 h-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-semibold text-black">{filtered.length}</span> shown
                {filterActive && (
                  <>
                    {' '}
                    of <span className="font-semibold text-black">{members.length}</span> total
                  </>
                )}
              </p>
              {placeFilter && (
                <p className="text-xs text-gray-500">
                  Filter: <span className="font-medium text-black">{placeFilter.place}</span> ({placeFilter.region})
                </p>
              )}
              {regionFilter && !placeFilter && (
                <p className="text-xs text-gray-500">
                  Region: <span className="font-medium text-black">{regionFilter}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-sm bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-semibold text-black">
              <MapPin className="w-5 h-5" />
              Team locations
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium">
              Click a location to filter the table. Use Edit or Delete on each row to maintain the directory.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {placeSummaries.map((row) => {
                const active =
                  placeFilter?.region === row.region && placeFilter?.place === row.place;
                return (
                  <button
                    key={`${row.region}-${row.place}`}
                    type="button"
                    onClick={() => selectPlace(row.region, row.place)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      active
                        ? 'border-black bg-gray-100 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-black">{row.place}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{row.region}</p>
                      </div>
                      <span className="text-sm font-bold text-black tabular-nums">{row.count}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Directory</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                    <th className="px-4 py-3 font-semibold">Employee ID</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Designation</th>
                    <th className="px-4 py-3 font-semibold">Region</th>
                    <th className="px-4 py-3 font-semibold">Place</th>
                    <th className="px-4 py-3 font-semibold w-36">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.key} className="border-b border-gray-100 hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-mono text-gray-800">{m.employeeId}</td>
                      <td className="px-4 py-3 font-medium text-black">{m.name}</td>
                      <td className="px-4 py-3 text-gray-700">{m.designation}</td>
                      <td className="px-4 py-3 text-gray-700">{m.region}</td>
                      <td className="px-4 py-3 text-gray-700">{m.place}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <Button variant="outline" size="sm" onClick={() => openEdit(m)} className="h-8">
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              if (!window.confirm(`Remove ${m.name} (${m.employeeId}) from the directory?`)) return;
                              deleteTeamMember(m.key);
                              refresh();
                              toast({ title: 'Removed', description: `${m.name} was deleted.` });
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="p-8 text-center text-gray-500">
                  {members.length === 0
                    ? 'No team members yet. Use Add team member above to add someone.'
                    : 'No team members match the current filters.'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md border-gray-200">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit team member' : 'Add team member'}</DialogTitle>
              <DialogDescription>
                {editing
                  ? 'Update their designation, region, or office. Employee ID should stay unique.'
                  : 'Leave employee ID blank to assign the next available ID automatically.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="tm-id">Employee ID</Label>
                <Input
                  id="tm-id"
                  value={form.employeeId}
                  onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
                  placeholder={editing ? '' : 'Optional — auto-generated if empty'}
                  className="font-mono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tm-name">Name</Label>
                <Input
                  id="tm-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tm-des">Designation</Label>
                <Input
                  id="tm-des"
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  placeholder="Role or title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tm-reg">Region</Label>
                <Input
                  id="tm-reg"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  placeholder="e.g. EMEA, Americas"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tm-place">Place / office</Label>
                <Input
                  id="tm-place"
                  value={form.place}
                  onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
                  placeholder="e.g. London HQ"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                {editing ? 'Save changes' : 'Add member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeamMembers;
