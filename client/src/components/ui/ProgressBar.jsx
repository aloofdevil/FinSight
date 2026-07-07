export default function ProgressBar({ value, max, color = '#6366f1', showLabel = true }) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = value > max;
  const barColor = isOver ? '#ef4444' : color;

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            ${value.toLocaleString()} / ${max.toLocaleString()}
          </span>
          <span className={isOver ? 'text-red-600 font-medium' : 'text-gray-500'}>
            {Math.round(percent)}%
          </span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
