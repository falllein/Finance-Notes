import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { formatIDR } from '@/utils/currency';

interface StatCardProps {
  title: string;
  amount: number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  amount, 
  icon, 
  trend, 
  color = '#10B981' 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark, color);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      
      <Text style={styles.amount}>{formatIDR(amount)}</Text>
      
      {trend && (
        <View style={styles.trendContainer}>
          <Text style={[
            styles.trend, 
            { color: trend.isPositive ? '#10B981' : '#EF4444' }
          ]}>
            {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
          </Text>
          <Text style={styles.trendLabel}>vs bulan lalu</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (isDark: boolean, color: string) => StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: color,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#4B5563' : '#F3F4F6',
  },
  amount: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trend: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginRight: 4,
  },
  trendLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
});