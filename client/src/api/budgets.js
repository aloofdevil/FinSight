import client from './client';

export const getBudgets = (params) => client.get('/api/budgets', { params });
export const getBudgetStatus = (params) => client.get('/api/budgets/status', { params });
export const createBudget = (data) => client.post('/api/budgets', data);
export const updateBudget = (id, data) => client.put(`/api/budgets/${id}`, data);
export const deleteBudget = (id) => client.delete(`/api/budgets/${id}`);
