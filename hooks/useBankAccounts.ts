import { useState, useEffect } from 'react';
import { BankAccount } from '@/types/transaction';
import { defaultBankAccounts } from '@/data/mockData';

export const useBankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from storage
    setTimeout(() => {
      setBankAccounts(defaultBankAccounts);
      setLoading(false);
    }, 300);
  }, []);

  const addBankAccount = (name: string) => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      name,
      balance: 0,
      totalIncome: 0,
      totalExpense: 0,
      currency: 'IDR',
      createdAt: new Date(),
    };
    setBankAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const updateBankAccountBalance = (bankName: string, amount: number, type: 'income' | 'expense') => {
    setBankAccounts(prev => 
      prev.map(account => {
        if (account.name === bankName) {
          const updatedAccount = { ...account };
          if (type === 'income') {
            updatedAccount.balance += amount;
            updatedAccount.totalIncome += amount;
          } else {
            updatedAccount.balance -= amount;
            updatedAccount.totalExpense += amount;
          }
          return updatedAccount;
        }
        return account;
      })
    );
  };

  const getBankAccountByName = (name: string) => {
    return bankAccounts.find(account => account.name === name);
  };

  return {
    bankAccounts,
    loading,
    addBankAccount,
    updateBankAccountBalance,
    getBankAccountByName,
  };
};