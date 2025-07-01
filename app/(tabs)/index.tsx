import React, { useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Modal
} from 'react-native';
import { StatCard } from '@/components/StatCard';
import { TransactionCard } from '@/components/TransactionCard';
import { IncomeForm } from '@/components/IncomeForm';
import { ExpenseForm } from '@/components/ExpenseForm';
import { TransactionSummary } from '@/components/TransactionSummary';
import { useTransactions } from '@/hooks/useTransactions';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { formatIDR } from '@/utils/currency';
import { TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ArrowDownLeft, ChartBar as BarChart3, Eye } from 'lucide-react-native';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  
  const { transactions, loading, getTotalByType } = useTransactions();
  const { bankAccounts } = useBankAccounts();

  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showTransactionSummary, setShowTransactionSummary] = useState(false);

  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
  }, []);

  const lastMonth = useMemo(() => {
    const now = new Date();
    const last = subMonths(now, 1);
    return {
      start: startOfMonth(last),
      end: endOfMonth(last),
    };
  }, []);

  const currentMonthIncome = getTotalByType('income', currentMonth);
  const currentMonthExpense = getTotalByType('expense', currentMonth);
  const lastMonthIncome = getTotalByType('income', lastMonth);
  const lastMonthExpense = getTotalByType('expense', lastMonth);

  const balance = currentMonthIncome - currentMonthExpense;
  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  
  const incomeTrend = lastMonthIncome > 0 
    ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
    : 0;
  
  const expenseTrend = lastMonthExpense > 0 
    ? ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 
    : 0;

  const recentTransactions = transactions.slice(0, 5);

  const handleFormSuccess = () => {
    // Refresh data or show success message
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.balanceLabel}>Total Bank Balance</Text>
          <Text style={[
            styles.balanceAmount, 
            { color: totalBankBalance >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {formatIDR(totalBankBalance)}
          </Text>
          <Text style={styles.monthlyBalanceLabel}>This Month's Net</Text>
          <Text style={[
            styles.monthlyBalance, 
            { color: balance >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {formatIDR(balance)}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <StatCard
                title="Income"
                amount={currentMonthIncome}
                icon={<TrendingUp size={20} color="#10B981" />}
                trend={{
                  value: incomeTrend,
                  isPositive: incomeTrend >= 0,
                }}
                color="#10B981"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="Expenses"
                amount={currentMonthExpense}
                icon={<TrendingDown size={20} color="#EF4444" />}
                trend={{
                  value: Math.abs(expenseTrend),
                  isPositive: expenseTrend <= 0,
                }}
                color="#EF4444"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => setShowTransactionSummary(true)}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => {
                  // Navigate to transaction details
                }}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Wallet size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first transaction to get started
              </Text>
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowIncomeForm(true)}
            >
              <ArrowUpRight size={24} color="#10B981" />
              <Text style={styles.actionText}>Add Income</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowExpenseForm(true)}
            >
              <ArrowDownLeft size={24} color="#EF4444" />
              <Text style={styles.actionText}>Add Expense</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.summaryButton}
            onPress={() => setShowTransactionSummary(true)}
          >
            <BarChart3 size={20} color="#3B82F6" />
            <Text style={styles.summaryButtonText}>View Full Summary</Text>
            <Eye size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowIncomeForm(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Income Form Modal */}
      <Modal
        visible={showIncomeForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <IncomeForm
          onClose={() => setShowIncomeForm(false)}
          onSuccess={handleFormSuccess}
        />
      </Modal>

      {/* Expense Form Modal */}
      <Modal
        visible={showExpenseForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onSuccess={handleFormSuccess}
        />
      </Modal>

      {/* Transaction Summary Modal */}
      <Modal
        visible={showTransactionSummary}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Transaction Summary</Text>
            <TouchableOpacity onPress={() => setShowTransactionSummary(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <TransactionSummary />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  monthlyBalanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginBottom: 2,
  },
  monthlyBalance: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#6B7280' : '#9CA3AF',
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  summaryButton: {
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
});