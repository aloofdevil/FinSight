import client from './client';

export const getSummary = (params) => client.get('/api/analytics/summary', { params });
export const getCategoryBreakdown = (params) => client.get('/api/analytics/category-breakdown', { params });
export const getMonthlyTrend = (params) => client.get('/api/analytics/monthly-trend', { params });
export const getTopSpendingDay = (params) => client.get('/api/analytics/top-spending-day', { params });
export const getAvgTransaction = (params) => client.get('/api/analytics/avg-transaction', { params });
