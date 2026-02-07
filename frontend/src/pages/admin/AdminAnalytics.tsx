import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

// Mock data - Yearly Revenue (Annual Report)
const yearlyRevenueData = [
  { year: '2020', revenue: 2.4, growth: 12 },
  { year: '2021', revenue: 3.1, growth: 29 },
  { year: '2022', revenue: 4.2, growth: 35 },
  { year: '2023', revenue: 5.8, growth: 38 },
  { year: '2024', revenue: 7.2, growth: 24 },
  { year: '2025', revenue: 8.9, growth: 24 },
];

// Mock data - Revenue by Source (Pie Chart)
const revenueBySourceData = [
  { name: 'Walk-in', value: 28, color: '#C9A227' },
  { name: 'Sales', value: 24, color: '#0B1F3A' },
  { name: 'Marketing', value: 18, color: '#DC2626' },
  { name: 'Calling', value: 14, color: '#16a34a' },
  { name: 'Social Media', value: 10, color: '#60a5fa' },
  { name: 'Referrals', value: 6, color: '#a78bfa' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200">
        <p className="font-semibold text-edicius-navy">{label}</p>
        <p className="text-edicius-gold font-medium">
          Revenue: ₹{payload[0].value} Cr
        </p>
        <p className="text-sm text-gray-600">
          Growth: {payload[0].payload.growth}%
        </p>
      </div>
    );
  }
  return null;
};

const AdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-edicius-navy mb-2 font-serif tracking-wide">
            Analytics
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Revenue insights and performance metrics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Yearly Revenue - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-edicius-navy flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-edicius-gold" />
                    Yearly Revenue Model
                  </CardTitle>
                  <span className="text-sm text-gray-500 font-medium">
                    Annual Report
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Revenue in Crores (₹ Cr) — Fiscal year performance
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={yearlyRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="year"
                        stroke="#6B7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <YAxis
                        stroke="#6B7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="revenue"
                        fill="#C9A227"
                        radius={[6, 6, 0, 0]}
                        name="Revenue (Cr)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue by Source - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-edicius-navy flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-edicius-gold" />
                    Revenue by Source
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Distribution across channels (% of total revenue)
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBySourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={115}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {revenueBySourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          `${value}%`,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value) => (
                          <span className="text-sm font-medium text-gray-700">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-gray-600">
                Total Revenue (2020-2025)
              </p>
              <p className="text-2xl font-bold text-edicius-navy mt-1">
                ₹ 31.6 Cr
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-gray-600">
                Top Revenue Channel
              </p>
              <p className="text-2xl font-bold text-edicius-navy mt-1">
                Walk-in (28%)
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-gray-600">
                YoY Growth (2025)
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">+24%</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
