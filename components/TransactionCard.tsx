import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Transaction } from '@/types/transaction';
import { formatIDR } from '@/utils/currency';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const styles = createStyles(isDark);
  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        {isIncome ? (
          <ArrowUpRight size={20} color="#10B981" />
        ) : (
          <ArrowDownLeft size={20} color="#EF4444" />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={[styles.amount, { color: isIncome ? '#10B981' : '#EF4444' }]}>
            {isIncome ? '+' : '-'}{formatIDR(transaction.amount)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={styles.date}>
            {format(new Date(transaction.date), 'dd MMM yyyy')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#4B5563' : '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
});