import { useState } from 'react';
import useExpenses from '../hooks/useExpenses';
import useCategories from '../hooks/useCategories';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import ExpenseModal from '../components/expenses/ExpenseModal';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { createExpense, updateExpense, deleteExpense } from '../api/expenses';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const { categories } = useCategories();
  const { expenses, pagination, loading, query, updateQuery, refetch } = useExpenses({ limit: 20 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateExpense(editing._id, data);
        toast.success('Transaction updated');
      } else {
        const res = await createExpense(data);
        toast.success('Transaction added');
        if (res.data.alert?.exceeded) {
          toast.error(`Budget exceeded by $${res.data.alert.overBy.toFixed(2)}!`);
        } else if (res.data.alert?.warning) {
          toast(`Budget at ${res.data.alert.percentUsed}%`, { icon: '!' });
        }
      }
      setModalOpen(false);
      setEditing(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await deleteExpense(id);
      toast.success('Transaction deleted');
      refetch();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (expense) => {
    setEditing(expense);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-4">
        <ExpenseFilters
          query={query}
          onQueryChange={updateQuery}
          categories={categories}
        />
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        {loading ? (
          <Spinner className="py-12" />
        ) : (
          <>
            <ExpenseTable expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
            <div className="px-4 pb-4">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={(page) => updateQuery({ page })}
              />
            </div>
          </>
        )}
      </div>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        expense={editing}
        categories={categories}
      />
    </div>
  );
}
