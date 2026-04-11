import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Landmark, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { companiesApi } from '@/lib/api';
import {
  addCompanyYearRevenue,
  deleteCompanyYearRevenue,
  loadCompanyRevenue,
  updateCompanyYearRevenue,
  type CompanyYearRevenue,
} from '@/lib/companyRevenueStore';

const emptyForm = { year: '', amountCr: '', note: '' };

const AdminRevenueCompany = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CompanyYearRevenue[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyYearRevenue | null>(null);
  const [form, setForm] = useState(emptyForm);

  const refreshRows = useCallback(() => {
    if (!slug) return;
    setRows(loadCompanyRevenue(slug));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        setLoading(true);
        const c = await companiesApi.getBySlug(slug);
        setCompany(c);
        setRows(loadCompanyRevenue(slug));
      } catch {
        toast({
          title: 'Company not found',
          description: 'Check the link or pick the company from Revenue again.',
          variant: 'destructive',
        });
        navigate('/admin/revenue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, navigate, toast]);

  const sumCr = useMemo(() => rows.reduce((s, r) => s + (Number.isFinite(r.amountCr) ? r.amountCr : 0), 0), [rows]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (r: CompanyYearRevenue) => {
    setEditing(r);
    setForm({
      year: String(r.year),
      amountCr: String(r.amountCr),
      note: r.note || '',
    });
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    const year = parseInt(form.year, 10);
    const amountCr = parseFloat(form.amountCr);
    if (!Number.isFinite(year) || year < 1900 || year > 2100) {
      toast({ title: 'Invalid year', description: 'Use a year between 1900 and 2100.', variant: 'destructive' });
      return;
    }
    if (!Number.isFinite(amountCr) || amountCr < 0) {
      toast({ title: 'Invalid amount', description: 'Enter revenue in ₹ Cr (0 or greater).', variant: 'destructive' });
      return;
    }
    try {
      if (editing) {
        updateCompanyYearRevenue(slug, editing.key, {
          year,
          amountCr,
          note: form.note.trim() ? form.note.trim() : undefined,
        });
        toast({ title: 'Updated', description: `FY ${year} saved.` });
      } else {
        addCompanyYearRevenue(slug, { year, amountCr, note: form.note.trim() || undefined });
        toast({ title: 'Added', description: `Revenue for ${year} recorded.` });
      }
      refreshRows();
      setDialogOpen(false);
    } catch (err) {
      if (err instanceof Error && err.message === 'DUPLICATE_YEAR') {
        toast({
          title: 'Year already exists',
          description: 'Edit the existing row or pick a different year.',
          variant: 'destructive',
        });
        return;
      }
      toast({ title: 'Save failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const handleDelete = (r: CompanyYearRevenue) => {
    if (!slug) return;
    if (!window.confirm(`Remove revenue entry for ${r.year}?`)) return;
    deleteCompanyYearRevenue(slug, r.key);
    refreshRows();
    toast({ title: 'Removed', description: `Year ${r.year} deleted.` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  if (!company || !slug) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/admin/revenue"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            All companies
          </Link>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 border border-gray-200">
                <Landmark className="w-6 h-6 text-black" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-black font-serif tracking-wide leading-tight">
                  {company.name}
                </h1>
                <p className="text-gray-600 mt-1 font-medium">Add or edit revenue by year (₹ Crores).</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-gray-600">Years on file</p>
              <p className="text-2xl font-bold text-black mt-1 tabular-nums">{rows.length}</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-gray-600">Total (sum of years)</p>
              <p className="text-2xl font-bold text-black mt-1 tabular-nums">₹ {sumCr.toFixed(2)} Cr</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-black">Yearly revenue</CardTitle>
            <Button type="button" onClick={openAdd} className="bg-black text-white hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              Add year
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {rows.length === 0 ? (
              <p className="px-6 pb-8 text-gray-500 text-sm">No entries yet. Use &quot;Add year&quot; to record revenue.</p>
            ) : (
              <div className="overflow-x-auto border-t border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b border-gray-100 bg-gray-50/80">
                      <th className="px-4 py-3 font-semibold">Year</th>
                      <th className="px-4 py-3 font-semibold">Revenue (₹ Cr)</th>
                      <th className="px-4 py-3 font-semibold">Note</th>
                      <th className="px-4 py-3 font-semibold w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-black tabular-nums">{r.year}</td>
                        <td className="px-4 py-3 tabular-nums">{r.amountCr.toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={r.note}>
                          {r.note || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => openEdit(r)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleDelete(r)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md border-gray-200">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit revenue' : 'Add revenue by year'}</DialogTitle>
              <DialogDescription>
                Amounts are stored in ₹ Crores (Cr). One row per calendar year for this company.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="rev-year">Year</Label>
                <Input
                  id="rev-year"
                  type="number"
                  min={1900}
                  max={2100}
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  placeholder="e.g. 2024"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rev-amt">Revenue (₹ Cr)</Label>
                <Input
                  id="rev-amt"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min={0}
                  value={form.amountCr}
                  onChange={(e) => setForm((f) => ({ ...f, amountCr: e.target.value }))}
                  placeholder="e.g. 12.5"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rev-note">Note (optional)</Label>
                <Input
                  id="rev-note"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="e.g. Audited, provisional…"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                {editing ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRevenueCompany;
