import { useState, useEffect, useCallback, useRef } from 'react';
import { getExpenses } from '../api/expenses';

export default function useExpenses(initialQuery = {}) {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExpenses(query);
      setExpenses(res.data.expenses);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = query.search ? 300 : 0;
    debounceRef.current = setTimeout(fetchExpenses, delay);
    return () => clearTimeout(debounceRef.current);
  }, [fetchExpenses, query.search]);

  const updateQuery = (newQuery) => {
    setQuery((prev) => ({ ...prev, ...newQuery }));
  };

  return { expenses, pagination, loading, query, updateQuery, refetch: fetchExpenses };
}
