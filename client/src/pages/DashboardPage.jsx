import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import MonthlyTrendChart from '../components/dashboard/MonthlyTrendChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import Spinner from '../components/ui/Spinner';
import { getSummary, getCategoryBreakdown, getMonthlyTrend } from '../api/analytics';
import { getExpenses } from '../api/expenses';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [summaryRes, breakdownRes, trendRes, recentRes] = await Promise.all([
          getSummary(),
          getCategoryBreakdown(),
          getMonthlyTrend({ months: 6 }),
          getExpenses({ limit: 5, sort: 'date', order: 'desc' })
        ]);
        setSummary(summaryRes.data.data);
        setBreakdown(breakdownRes.data.data);
        setTrend(trendRes.data.data);
        setRecent(recentRes.data.expenses);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner className="min-h-[60vh]" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Expenses" value={summary?.totalExpense || 0} icon={TrendingDown} color="#ef4444" />
        <StatCard title="Total Income" value={summary?.totalIncome || 0} icon={TrendingUp} color="#22c55e" />
        <StatCard title="Net Balance" value={summary?.net || 0} icon={DollarSign} color="#3b82f6" />
        <StatCard title="Transactions" value={(summary?.expenseCount ?? 0) + (summary?.incomeCount ?? 0)} icon={Activity} color="#a855f7" prefix="" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-4 lg:p-5">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
          <CategoryPieChart data={breakdown} />
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4 lg:p-5">
          <h2 className="text-lg font-semibold mb-4">Monthly Trend</h2>
          <MonthlyTrendChart data={trend} />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-4 lg:p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <RecentTransactions expenses={recent} />
      </div>
    </div>
  );
}
