import client from './client';

export const getExpenses = (params) => client.get('/api/expenses', { params });
export const createExpense = (data) => client.post('/api/expenses', data);
export const updateExpense = (id, data) => client.put(`/api/expenses/${id}`, data);
export const deleteExpense = (id) => client.delete(`/api/expenses/${id}`);
