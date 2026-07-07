import { Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { format } from 'date-fns';

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No transactions found</p>
        <p className="text-sm mt-1">Add your first expense or income to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-2 font-medium text-gray-500">Category</th>
            <th className="text-left py-3 px-2 font-medium text-gray-500">Description</th>
            <th className="text-right py-3 px-2 font-medium text-gray-500">Amount</th>
            <th className="text-right py-3 px-2 font-medium text-gray-500 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2 text-gray-600">{format(new Date(exp.date), 'MMM d, yyyy')}</td>
              <td className="py-3 px-2">
                <Badge color={exp.category?.color}>
                  {exp.category?.icon} {exp.category?.name}
                </Badge>
              </td>
              <td className="py-3 px-2 text-gray-700">{exp.description || '—'}</td>
              <td className={`py-3 px-2 text-right font-medium ${exp.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                {exp.type === 'income' ? '+' : '-'}${exp.amount.toLocaleString()}
              </td>
              <td className="py-3 px-2 text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(exp)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(exp._id)}>
                    <Trash2 size={14} className="text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
