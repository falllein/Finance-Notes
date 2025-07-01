import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { TransactionCard } from './TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { formatIDR } from '@/utils/currency';
import { Search, Filter, Calendar, TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export const TransactionSummary: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const { transactions } = useTransactions();
  const { bankAccounts } = useBankAccounts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        transaction.category
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        transaction.category === selectedCategory;
      
      const matchesType = selectedType === 'all' || 
        transaction.type === selectedType;

      const transactionDate = new Date(transaction.date);
      const matchesDateRange = transactionDate >= dateRange.start && 
        transactionDate <= dateRange.end;

      return matchesSearch && matchesCategory && matchesType && matchesDateRange;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType, dateRange]);

  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netBalance };
  }, [filteredTransactions]);

  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Wallet size={20} color="#10B981" />
              <Text style={styles.cardTitle}>Total Balance</Text>
            </View>
            <Text style={[styles.cardAmount, { color: '#10B981' }]}>
              {formatIDR(totalBankBalance)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.halfCard]}>
              <View style={styles.cardHeader}>
                <TrendingUp size={16} color="#10B981" />
                <Text style={styles.cardTitleSmall}>Income</Text>
              </View>
              <Text style={[styles.cardAmountSmall, { color: '#10B981' }]}>
                {formatIDR(summary.totalIncome)}
              </Text>
            </View>

            <View style={[styles.summaryCard, styles.halfCard]}>
              <View style={styles.cardHeader}>
                <TrendingDown size={16} color="#EF4444" />
                <Text style={styles.cardTitleSmall}>Expenses</Text>
              </View>
              <Text style={[styles.cardAmountSmall, { color: '#EF4444' }]}>
                {formatIDR(summary.totalExpense)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bank Accounts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Accounts</Text>
        <View style={styles.bankAccountsList}>
          {bankAccounts.map((account) => (
            <View key={account.id} style={styles.bankAccountCard}>
              <Text style={styles.bankName}>{account.name}</Text>
              <Text style={[
                styles.bankBalance,
                { color: account.balance >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {formatIDR(account.balance)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.filterTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedType === 'all' && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedType('all')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedType === 'all' && styles.activeFilterTabText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedType === 'income' && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedType('income')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedType === 'income' && styles.activeFilterTabText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedType === 'expense' && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedType('expense')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedType === 'expense' && styles.activeFilterTabText,
                ]}
              >
                Expenses
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsList}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <TransactionCard
                transaction={transaction}
                onPress={() => {
                  // Navigate to transaction details
                }}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filters or add new transactions
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
  },
  summarySection: {
    padding: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginBottom: 16,
  },
  summaryCards: {
    gap: 12,
  },
  summaryCard: {
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  cardTitleSmall: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  cardAmount: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
  },
  cardAmountSmall: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  bankAccountsList: {
    gap: 8,
  },
  bankAccountCard: {
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bankName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  bankBalance: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  filterTabs: {
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
  },
  activeFilterTab: {
    backgroundColor: '#10B981',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  transactionsList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#6B7280' : '#9CA3AF',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});