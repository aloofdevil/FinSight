import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function BudgetModal({ isOpen, onClose, onSave, categories, currentMonth, currentYear }) {
  const [form, setForm] = useState({
    categoryId: '',
    monthlyLimit: ''
  });

  useEffect(() => {
    if (isOpen) {
      setForm({ categoryId: categories[0]?._id || '', monthlyLimit: '' });
    }
  }, [isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      monthlyLimit: parseFloat(form.monthlyLimit),
      month: currentMonth,
      year: currentYear
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Category"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          options={categories.map((c) => ({ value: c._id, label: `${c.icon} ${c.name}` }))}
          required
        />
        <Input
          label="Monthly Limit ($)"
          type="number"
          step="0.01"
          min="1"
          value={form.monthlyLimit}
          onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
          required
        />
        <p className="text-sm text-gray-500">
          Setting budget for {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Set Budget</Button>
        </div>
      </form>
    </Modal>
  );
}
