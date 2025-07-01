export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  accountId?: string;
  bankName?: string;
  receiptImage?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  budget?: number;
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit' | 'investment';
  balance: number;
  currency: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  spent: number;
  remaining: number;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  currency: string;
  createdAt: Date;
}