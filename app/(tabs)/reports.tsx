import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTransactions } from '@/hooks/useTransactions';
import { formatIDR } from '@/utils/currency';
import { TrendingUp, TrendingDown, Calendar, Download, ChartPie as PieChart, ChartBar as BarChart3 } from 'lucide-react-native';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subMonths,
  format 
} from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  
  const { transactions, getTotalByType } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');

  const currentPeriod = useMemo(() => {
    const now = new Date();
    if (selectedPeriod === 'month') {
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        label: format(now, 'MMMM yyyy'),
      };
    } else {
      return {
        start: startOfYear(now),
        end: endOfYear(now),
        label: format(now, 'yyyy'),
      };
    }
  }, [selectedPeriod]);

  const previousPeriod = useMemo(() => {
    const now = new Date();
    if (selectedPeriod === 'month') {
      const prev = subMonths(now, 1);
      return {
        start: startOfMonth(prev),
        end: endOfMonth(prev),
        label: format(prev, 'MMMM yyyy'),
      };
    } else {
      const prev = new Date(now.getFullYear() - 1, 0, 1);
      return {
        start: startOfYear(prev),
        end: endOfYear(prev),
        label: format(prev, 'yyyy'),
      };
    }
  }, [selectedPeriod]);

  const currentIncome = getTotalByType('income', currentPeriod);
  const currentExpense = getTotalByType('expense', currentPeriod);
  const previousIncome = getTotalByType('income', previousPeriod);
  const previousExpense = getTotalByType('expense', previousPeriod);

  const incomeChange = previousIncome > 0 
    ? ((currentIncome - previousIncome) / previousIncome) * 100 
    : 0;
  
  const expenseChange = previousExpense > 0 
    ? ((currentExpense - previousExpense) / previousExpense) * 100 
    : 0;

  const netIncome = currentIncome - currentExpense;
  const savingsRate = currentIncome > 0 ? (netIncome / currentIncome) * 100 : 0;

  // Calculate category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {};
    
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return date >= currentPeriod.start && date <= currentPeriod.end && t.type === 'expense';
      })
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      });

    return Object.entries(breakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions, currentPeriod]);

  const totalCategoryExpenses = categoryBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Laporan Keuangan</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color={isDark ? '#F3F4F6' : '#1F2937'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === 'month' && styles.activePeriodButtonText,
              ]}
            >
              Bulanan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'year' && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === 'year' && styles.activePeriodButtonText,
              ]}
            >
              Tahunan
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.periodLabel}>Periode: {currentPeriod.label}</Text>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Total Pemasukan</Text>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text style={styles.summaryAmount}>{formatIDR(currentIncome)}</Text>
            <Text style={[
              styles.summaryChange,
              { color: incomeChange >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% vs periode sebelumnya
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Total Pengeluaran</Text>
              <TrendingDown size={20} color="#EF4444" />
            </View>
            <Text style={styles.summaryAmount}>{formatIDR(currentExpense)}</Text>
            <Text style={[
              styles.summaryChange,
              { color: expenseChange <= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}% vs periode sebelumnya
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Saldo Bersih</Text>
              <Calendar size={20} color={netIncome >= 0 ? '#10B981' : '#EF4444'} />
            </View>
            <Text style={[
              styles.summaryAmount,
              { color: netIncome >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {formatIDR(netIncome)}
            </Text>
            <Text style={styles.summaryChange}>
              Tingkat tabungan: {savingsRate.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <PieChart size={20} color={isDark ? '#F3F4F6' : '#1F2937'} />
            <Text style={styles.sectionTitle}>Pengeluaran per Kategori</Text>
          </View>
          
          <View style={styles.categoryChart}>
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((item, index) => {
                const percentage = totalCategoryExpenses > 0 
                  ? (item.amount / totalCategoryExpenses) * 100 
                  : 0;
                
                return (
                  <View key={item.category} style={styles.categoryItem}>
                    <View style={styles.categoryInfo}>
                      <View style={[
                        styles.categoryColor,
                        { backgroundColor: getCategoryColor(index) }
                      ]} />
                      <Text style={styles.categoryName}>{item.category}</Text>
                    </View>
                    <View style={styles.categoryStats}>
                      <Text style={styles.categoryAmount}>
                        {formatIDR(item.amount)}
                      </Text>
                      <Text style={styles.categoryPercentage}>
                        {percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>
                  Tidak ada data pengeluaran untuk periode ini
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={20} color={isDark ? '#F3F4F6' : '#1F2937'} />
            <Text style={styles.sectionTitle}>Perbandingan Periode</Text>
          </View>
          
          <View style={styles.comparisonChart}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Pemasukan</Text>
              <View style={styles.comparisonBars}>
                <View style={styles.comparisonBar}>
                  <Text style={styles.comparisonPeriod}>Sebelumnya</Text>
                  <View style={[
                    styles.bar,
                    { 
                      width: previousIncome > 0 ? '80%' : '5%',
                      backgroundColor: '#9CA3AF'
                    }
                  ]} />
                  <Text style={styles.comparisonAmount}>
                    {formatIDR(previousIncome)}
                  </Text>
                </View>
                <View style={styles.comparisonBar}>
                  <Text style={styles.comparisonPeriod}>Sekarang</Text>
                  <View style={[
                    styles.bar,
                    { 
                      width: currentIncome > Math.max(previousIncome, 1) ? '100%' : 
                             (currentIncome / Math.max(previousIncome, 1)) * 100 + '%',
                      backgroundColor: '#10B981'
                    }
                  ]} />
                  <Text style={styles.comparisonAmount}>
                    {formatIDR(currentIncome)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Pengeluaran</Text>
              <View style={styles.comparisonBars}>
                <View style={styles.comparisonBar}>
                  <Text style={styles.comparisonPeriod}>Sebelumnya</Text>
                  <View style={[
                    styles.bar,
                    { 
                      width: previousExpense > 0 ? '80%' : '5%',
                      backgroundColor: '#9CA3AF'
                    }
                  ]} />
                  <Text style={styles.comparisonAmount}>
                    {formatIDR(previousExpense)}
                  </Text>
                </View>
                <View style={styles.comparisonBar}>
                  <Text style={styles.comparisonPeriod}>Sekarang</Text>
                  <View style={[
                    styles.bar,
                    { 
                      width: currentExpense > Math.max(previousExpense, 1) ? '100%' : 
                             (currentExpense / Math.max(previousExpense, 1)) * 100 + '%',
                      backgroundColor: '#EF4444'
                    }
                  ]} />
                  <Text style={styles.comparisonAmount}>
                    {formatIDR(currentExpense)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getCategoryColor = (index: number): string => {
  const colors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6'];
  return colors[index % colors.length];
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  periodLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  summaryCards: {
    gap: 16,
    marginBottom: 32,
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  summaryAmount: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginBottom: 8,
  },
  summaryChange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  chartSection: {
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  categoryChart: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyChartText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  comparisonChart: {
    gap: 24,
  },
  comparisonItem: {
    gap: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  comparisonBars: {
    gap: 8,
  },
  comparisonBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  comparisonPeriod: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    width: 80,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    minWidth: 20,
  },
  comparisonAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginLeft: 'auto',
  },
});