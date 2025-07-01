import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { TransactionCard } from '@/components/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import { defaultCategories } from '@/data/mockData';
import { Search, Filter, Plus } from 'lucide-react-native';

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  
  const { transactions, loading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

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

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType]);

  const categories = ['all', ...defaultCategories.map(cat => cat.name)];

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
      <View style={styles.header}>
        <Text style={styles.title}>Transaksi</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={isDark ? '#F3F4F6' : '#1F2937'} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari transaksi..."
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
              Semua
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
              Pemasukan
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
              Pengeluaran
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.emptyText}>Tidak ada transaksi ditemukan</Text>
            <Text style={styles.emptySubtext}>
              Coba ubah filter atau tambahkan transaksi baru
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
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
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    flex: 1,
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
});