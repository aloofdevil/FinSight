import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function BudgetAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 p-3 rounded-lg border ${
            alert.percentUsed >= 100
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          {alert.percentUsed >= 100 ? (
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">
              {alert.categoryIcon} {alert.categoryName}
            </p>
            <p className="text-xs opacity-75">
              {alert.percentUsed >= 100
                ? `Budget exceeded! Spent $${alert.spent.toLocaleString()} of $${alert.monthlyLimit.toLocaleString()}`
                : `Budget at ${Math.round(alert.percentUsed)}% - $${alert.spent.toLocaleString()} of $${alert.monthlyLimit.toLocaleString()}`}
            </p>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
            {Math.round(alert.percentUsed)}%
          </span>
        </div>
      ))}
    </div>
  );
}
