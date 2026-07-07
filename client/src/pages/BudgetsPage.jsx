import { useState } from 'react';
import useBudgets from '../hooks/useBudgets';
import useCategories from '../hooks/useCategories';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import BudgetModal from '../components/budgets/BudgetModal';
import { createBudget } from '../api/budgets';
import { useDataRefresh } from '../context/DataRefreshContext';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BudgetsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [modalOpen, setModalOpen] = useState(false);

  const { budgets, loading, refetch } = useBudgets(month, year);
  const { categories } = useCategories();
  const { triggerRefresh } = useDataRefresh();

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleSave = async (data) => {
    try {
      await createBudget(data);
      toast.success('Budget set');
      setModalOpen(false);
      refetch();
      triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set budget');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-1" /> Set Budget
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => changeMonth(-1)}>
          <ChevronLeft size={18} />
        </Button>
        <span className="text-lg font-medium">{monthName}</span>
        <Button variant="ghost" size="sm" onClick={() => changeMonth(1)}>
          <ChevronRight size={18} />
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-12" />
      ) : budgets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No budgets set</p>
          <p className="text-sm mt-1">Set a monthly budget to track your spending.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {budgets.map((b) => (
            <div key={b._id || `${b.categoryName}-${b.month}`} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{b.categoryIcon}</span>
                <span className="font-medium">{b.categoryName}</span>
                {b.percentUsed > 100 && (
                  <span className="ml-auto text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    OVER
                  </span>
                )}
              </div>
              <ProgressBar
                value={b.spent}
                max={b.monthlyLimit}
                color={b.categoryColor}
              />
              <div className="mt-2 text-sm text-gray-500">
                {b.remaining >= 0
                  ? `$${b.remaining.toLocaleString()} remaining`
                  : `$${Math.abs(b.remaining).toLocaleString()} over budget`}
              </div>
            </div>
          ))}
        </div>
      )}

      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        currentMonth={month}
        currentYear={year}
      />
    </div>
  );
}
