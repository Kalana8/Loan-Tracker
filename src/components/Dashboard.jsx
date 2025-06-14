import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Users, TrendingUp, CheckCircle, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatCurrencyCompact } from '@/utils/currencyUtils';

const getMonthYear = (dateString) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export function Dashboard({ customers, loans, payments }) {
  const [selectedMonth, setSelectedMonth] = useState('all');

  const monthlyInterestData = useMemo(() => {
    const monthlyData = {};
    payments.forEach(payment => {
      if (payment.status === 'paid' && payment.payment_date) {
        const monthYear = getMonthYear(payment.payment_date);
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += payment.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    return sortedMonths.map(month => ({
      name: month,
      'Interest Collected': monthlyData[month]
    }));
  }, [payments]);

  const availableMonths = useMemo(() => {
    const months = new Set(monthlyInterestData.map(d => d.name));
    return ['all', ...Array.from(months).sort()];
  }, [monthlyInterestData]);

  const filteredPayments = useMemo(() => {
    if (selectedMonth === 'all') {
      return payments;
    }
    return payments.filter(payment => {
      if (payment.status === 'paid' && payment.payment_date) {
        return getMonthYear(payment.payment_date) === selectedMonth;
      }
      return false;
    });
  }, [payments, selectedMonth]);

  const totalLoansGiven = loans.reduce((sum, loan) => sum + (loan.loan_amount || 0), 0);
  const totalInterestCollected = filteredPayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const activeLoans = loans.filter(loan => loan.status === 'ongoing').length;
  const completedLoans = loans.filter(loan => loan.status === 'fully_paid').length;

  const stats = [
    {
      title: "Total Loans Given",
      value: formatCurrency(totalLoansGiven),
      icon: DollarSign,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: selectedMonth === 'all' ? "Total Interest Collected" : `Interest Collected (${selectedMonth})`,
      value: formatCurrency(totalInterestCollected),
      icon: TrendingUp,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Active Loans",
      value: activeLoans,
      icon: Users,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Completed Loans",
      value: completedLoans,
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-gray-600" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map(month => (
                <SelectItem key={month} value={month}>
                  {month === 'all' ? 'All Months' : month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-gradient border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="card-gradient border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Monthly Interest Collection</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyInterestData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyInterestData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrencyCompact(value)} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), "Interest Collected"]}
                    labelStyle={{ color: "#333" }}
                    itemStyle={{ color: "#059669" }}
                    wrapperClassName="rounded-md shadow-lg !bg-white/80 !backdrop-blur-sm !border-none"
                  />
                  <Legend wrapperStyle={{ fontSize: "14px" }} />
                  <Bar dataKey="Interest Collected" fill="url(#colorInterest)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No payment data available to display chart.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
