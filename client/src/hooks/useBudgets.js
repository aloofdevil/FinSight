import { useState, useEffect, useCallback } from 'react';
import { getBudgetStatus } from '../api/budgets';

export default function useBudgets(month, year) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBudgetStatus({ month, year });
      setBudgets(res.data.data);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return { budgets, loading, refetch: fetchBudgets };
}
