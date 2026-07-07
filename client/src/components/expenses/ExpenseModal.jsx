import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function ExpenseModal({ isOpen, onClose, onSave, expense, categories }) {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount,
        category: expense.category?._id || expense.category,
        description: expense.description || '',
        date: new Date(expense.date).toISOString().split('T')[0],
        type: expense.type
      });
    } else {
      setForm({
        amount: '',
        category: categories[0]?._id || '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      });
    }
  }, [expense, isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' }
          ]}
        />
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          options={categories.map((c) => ({ value: c._id, label: `${c.icon} ${c.name}` }))}
          required
        />
        <Input
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What was this for?"
        />
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{expense ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  );
}
