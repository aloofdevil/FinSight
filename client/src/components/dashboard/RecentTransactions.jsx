import { format } from 'date-fns';

export default function RecentTransactions({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No recent transactions
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((exp) => (
        <div key={exp._id} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <span className="text-lg">{exp.category?.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{exp.description || exp.category?.name}</p>
              <p className="text-xs text-gray-500">{format(new Date(exp.date), 'MMM d, yyyy')}</p>
            </div>
          </div>
          <span className={`text-sm font-medium ${exp.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
            {exp.type === 'income' ? '+' : '-'}${exp.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
