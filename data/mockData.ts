import { Transaction, Category, Account, BankAccount } from '@/types/transaction';

export const defaultCategories: Category[] = [
  // Expense Categories
  { id: '1', name: 'Food & Beverages', type: 'expense', icon: '🍔', color: '#EF4444' },
  { id: '2', name: 'Transportation', type: 'expense', icon: '🚗', color: '#F97316' },
  { id: '3', name: 'Shopping', type: 'expense', icon: '🛒', color: '#8B5CF6' },
  { id: '4', name: 'Bills & Utilities', type: 'expense', icon: '💡', color: '#06B6D4' },
  { id: '5', name: 'Entertainment', type: 'expense', icon: '🎬', color: '#F59E0B' },
  { id: '6', name: 'Others', type: 'expense', icon: '📦', color: '#6B7280' },
  
  // Income Categories
  { id: '7', name: 'Salary', type: 'income', icon: '💰', color: '#10B981' },
  { id: '8', name: 'Freelance', type: 'income', icon: '💻', color: '#3B82F6' },
  { id: '9', name: 'Investment', type: 'income', icon: '📈', color: '#8B5CF6' },
  { id: '10', name: 'Bonus', type: 'income', icon: '🎁', color: '#F59E0B' },
  { id: '11', name: 'Others', type: 'income', icon: '💵', color: '#10B981' },
];

export const defaultAccounts: Account[] = [
  { id: '1', name: 'BCA - Tabungan', type: 'bank', balance: 5000000, currency: 'IDR' },
  { id: '2', name: 'Mandiri - Giro', type: 'bank', balance: 3500000, currency: 'IDR' },
  { id: '3', name: 'Cash', type: 'cash', balance: 500000, currency: 'IDR' },
  { id: '4', name: 'Kartu Kredit BNI', type: 'credit', balance: -1200000, currency: 'IDR' },
];

export const defaultBankAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'BCA - Tabungan',
    balance: 5000000,
    totalIncome: 8500000,
    totalExpense: 3500000,
    currency: 'IDR',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Mandiri - Giro',
    balance: 3500000,
    totalIncome: 5000000,
    totalExpense: 1500000,
    currency: 'IDR',
    createdAt: new Date('2024-01-01'),
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 85000,
    category: 'Food & Beverages',
    description: 'Makan siang di restoran',
    date: new Date('2024-01-15'),
    accountId: '1',
    bankName: 'BCA - Tabungan',
  },
  {
    id: '2',
    type: 'expense',
    amount: 50000,
    category: 'Transportation',
    description: 'Bensin motor',
    date: new Date('2024-01-15'),
    accountId: '3',
    bankName: 'Cash',
  },
  {
    id: '3',
    type: 'income',
    amount: 8500000,
    category: 'Salary',
    description: 'Gaji bulan Januari',
    date: new Date('2024-01-01'),
    accountId: '1',
    bankName: 'BCA - Tabungan',
  },
  {
    id: '4',
    type: 'expense',
    amount: 250000,
    category: 'Shopping',
    description: 'Belanja groceries',
    date: new Date('2024-01-14'),
    accountId: '2',
    bankName: 'Mandiri - Giro',
  },
  {
    id: '5',
    type: 'expense',
    amount: 150000,
    category: 'Bills & Utilities',
    description: 'Listrik bulan ini',
    date: new Date('2024-01-10'),
    accountId: '1',
    bankName: 'BCA - Tabungan',
  },
  {
    id: '6',
    type: 'income',
    amount: 2000000,
    category: 'Freelance',
    description: 'Project web development',
    date: new Date('2024-01-12'),
    accountId: '2',
    bankName: 'Mandiri - Giro',
  },
];