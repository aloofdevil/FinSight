import { Search } from 'lucide-react';
import Select from '../ui/Select';

export default function ExpenseFilters({ query, onQueryChange, categories }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={query.search || ''}
          onChange={(e) => onQueryChange({ search: e.target.value })}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <Select
        value={query.category || ''}
        onChange={(e) => onQueryChange({ category: e.target.value || undefined })}
        options={[
          { value: '', label: 'All Categories' },
          ...categories.map((c) => ({ value: c._id, label: `${c.icon} ${c.name}` }))
        ]}
      />
      <Select
        value={query.type || ''}
        onChange={(e) => onQueryChange({ type: e.target.value || undefined })}
        options={[
          { value: '', label: 'All Types' },
          { value: 'expense', label: 'Expenses' },
          { value: 'income', label: 'Income' }
        ]}
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={query.from || ''}
          onChange={(e) => onQueryChange({ from: e.target.value || undefined })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="From"
        />
        <input
          type="date"
          value={query.to || ''}
          onChange={(e) => onQueryChange({ to: e.target.value || undefined })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="To"
        />
      </div>
    </div>
  );
}
