import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary]           = useState(null);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(false);
  const [filters, setFilters]           = useState({ page: 1, limit: 20 });

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const merged = { ...filters, ...params };
      setFilters(merged);
      const { data } = await api.get('/transactions', { params: merged });
      setTransactions(data.transactions);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchSummary = useCallback(async () => {
    const { data } = await api.get('/transactions/summary');
    setSummary(data);
  }, []);

  const createTransaction = async (payload) => {
    const { data } = await api.post('/transactions', payload);
    await Promise.all([fetchTransactions(), fetchSummary()]);
    return data.transaction;
  };

  const updateTransaction = async (id, payload) => {
    const { data } = await api.put(`/transactions/${id}`, payload);
    await Promise.all([fetchTransactions(), fetchSummary()]);
    return data.transaction;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    await Promise.all([fetchTransactions(), fetchSummary()]);
  };

  return (
    <TransactionContext.Provider value={{
      transactions, summary, total, loading, filters,
      fetchTransactions, fetchSummary,
      createTransaction, updateTransaction, deleteTransaction,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be inside TransactionProvider');
  return ctx;
};
