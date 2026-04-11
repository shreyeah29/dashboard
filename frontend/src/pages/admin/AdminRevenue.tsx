import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Landmark, PenLine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { companiesApi } from '@/lib/api';
import { sortCompaniesByRevenueDisplayOrder } from '@/lib/revenueCompanyOrder';
import { revenueYearCount } from '@/lib/companyRevenueStore';

const AdminRevenue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await companiesApi.getAll();
        setCompanies(data);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load companies.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const ordered = useMemo(() => sortCompaniesByRevenueDisplayOrder(companies), [companies]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gray-100 border border-gray-200">
              <Landmark className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black font-serif tracking-wide">Revenue</h1>
              <p className="text-gray-600 mt-1 font-medium">
                Companies from your directory, sorted into the standard revenue reporting sequence.
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
          </div>
        ) : (
          <ol className="space-y-3">
            {ordered.map((company, index) => (
              <motion.li
                key={company._id || company.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
              >
                <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow group">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                      <button
                        type="button"
                        className="flex flex-1 text-left min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset rounded-none"
                        onClick={() => navigate(`/admin/revenue/${company.slug}`)}
                      >
                        <div className="flex sm:w-28 shrink-0 items-center justify-center bg-gray-100 border-b sm:border-b-0 sm:border-r border-gray-200 py-4 sm:py-0 group-hover:bg-gray-200/80 transition-colors">
                          <span className="text-2xl font-bold text-gray-400 tabular-nums">{index + 1}</span>
                        </div>
                        <div className="flex flex-1 min-w-0 gap-4 p-4">
                          {company.heroImage && (
                            <img
                              src={company.heroImage}
                              alt=""
                              className="hidden sm:block w-24 h-24 rounded-lg object-cover shrink-0 border border-gray-200"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-bold text-gray-900 leading-snug">{company.name}</h2>
                              {revenueYearCount(company.slug) > 0 && (
                                <Badge variant="secondary" className="font-medium">
                                  {revenueYearCount(company.slug)} yrs
                                </Badge>
                              )}
                            </div>
                            {company.overview && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{company.overview}</p>
                            )}
                            <p className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1">
                              <PenLine className="w-3.5 h-3.5" />
                              Click to add or edit revenue by year
                            </p>
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center gap-2 px-4 pb-4 sm:pb-0 sm:flex-col sm:justify-center sm:border-l border-gray-100 sm:pr-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-gray-300 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/companies/${company.slug}/projects`);
                          }}
                        >
                          <Building2 className="w-4 h-4 sm:mr-0 md:mr-2" />
                          <span className="hidden md:inline">Units</span>
                          <ChevronRight className="w-4 h-4 ml-0 md:ml-1 opacity-60 hidden md:inline" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ol>
        )}

        {!loading && ordered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No companies found.</p>
        )}

      </div>
    </div>
  );
};

export default AdminRevenue;
