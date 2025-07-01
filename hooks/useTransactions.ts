import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { mockTransactions } from '@/data/mockData';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from storage
    setTimeout(() => {
      setTransactions(mockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    }, 500);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const getTransactionsByCategory = (category: string) => {
    return transactions.filter(transaction => transaction.category === category);
  };

  const getTransactionsByBankName = (bankName: string) => {
    return transactions.filter(transaction => transaction.bankName === bankName);
  };

  const getTotalByType = (type: 'income' | 'expense', dateRange?: { start: Date; end: Date }) => {
    let filtered = transactions.filter(t => t.type === type);
    
    if (dateRange) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date >= dateRange.start && date <= dateRange.end;
      });
    }
    
    return filtered.reduce((total, transaction) => total + transaction.amount, 0);
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    getTransactionsByBankName,
    getTotalByType,
  };
};