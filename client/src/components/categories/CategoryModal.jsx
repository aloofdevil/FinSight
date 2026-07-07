import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#6b7280'];
const ICONS = ['🍔', '🚗', '🛒', '🎬', '💡', '🏥', '📚', '📦', '💰', '🏠', '✈️', '🎮', '☕', '👕', '🎁', '❓'];

export default function CategoryModal({ isOpen, onClose, onSave, category }) {
  const [form, setForm] = useState({ name: '', icon: '📦', color: '#6366f1' });

  useEffect(() => {
    if (category) {
      setForm({ name: category.name, icon: category.icon, color: category.color });
    } else {
      setForm({ name: '', icon: '📦', color: '#6366f1' });
    }
  }, [category, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'New Category'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          maxLength={50}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm({ ...form, icon })}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border-2 transition-colors ${
                  form.icon === icon ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, color })}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  form.color === color ? 'border-gray-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{category ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
}
