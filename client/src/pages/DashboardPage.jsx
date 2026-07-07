import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, DollarSign, Activity, Calendar, BarChart3 } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import MonthlyTrendChart from '../components/dashboard/MonthlyTrendChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetAlerts from '../components/dashboard/BudgetAlerts';
import Spinner from '../components/ui/Spinner';
import { getSummary, getCategoryBreakdown, getMonthlyTrend, getTopSpendingDay, getAvgTransaction } from '../api/analytics';
import { getBudgetStatus } from '../api/budgets';
import { getExpenses } from '../api/expenses';
import { useDataRefresh } from '../context/DataRefreshContext';

export default function DashboardPage() {
  const { refreshKey } = useDataRefresh();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);
  const [topDay, setTopDay] = useState(null);
  const [avgTx, setAvgTx] = useState(null);
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, breakdownRes, trendRes, recentRes, topDayRes, avgTxRes, budgetRes] = await Promise.all([
        getSummary(),
        getCategoryBreakdown(),
        getMonthlyTrend({ months: 6 }),
        getExpenses({ limit: 5, sort: 'date', order: 'desc' }),
        getTopSpendingDay(),
        getAvgTransaction(),
        getBudgetStatus()
      ]);
      setSummary(summaryRes.data.data);
      setBreakdown(breakdownRes.data.data);
      setTrend(trendRes.data.data);
      setRecent(recentRes.data.expenses);
      setTopDay(topDayRes.data.data);
      setAvgTx(avgTxRes.data.data);
      setBudgetAlerts(budgetRes.data.data.filter(b => b.percentUsed >= 80));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [refreshKey]);

  if (loading) return <Spinner className="min-h-[60vh]" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={fetchDashboard} className="text-sm text-indigo-600 hover:text-indigo-800">
          Refresh
        </button>
      </div>

      {budgetAlerts.length > 0 && <BudgetAlerts alerts={budgetAlerts} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Expenses" value={summary?.totalExpense || 0} icon={TrendingDown} color="#ef4444" />
        <StatCard title="Total Income" value={summary?.totalIncome || 0} icon={TrendingUp} color="#22c55e" />
        <StatCard title="Net Balance" value={summary?.net || 0} icon={DollarSign} color="#3b82f6" />
        <StatCard title="Transactions" value={(summary?.expenseCount ?? 0) + (summary?.incomeCount ?? 0)} icon={Activity} color="#a855f7" prefix="" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border shadow-sm p-4 lg:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-orange-500" />
            <span className="text-sm text-gray-500">Top Spending Day</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {topDay?._id || 'No data'} {topDay?.total ? `- $${topDay.total.toLocaleString()}` : ''}
          </p>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4 lg:p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-purple-500" />
            <span className="text-sm text-gray-500">Avg Transaction</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            ${avgTx?.avgAmount?.toFixed(2) || '0.00'}
          </p>
        </div>
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
