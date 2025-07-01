import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { formatIDR } from '@/utils/currency';
import { Calendar, DollarSign, Building2, Save, X, ChevronDown } from 'lucide-react-native';

interface ExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const expenseCategories = [
  'Food & Beverages',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Others',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSuccess }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const { bankAccounts, updateBankAccountBalance, getBankAccountByName } = useBankAccounts();
  const { addTransaction } = useTransactions();

  const [formData, setFormData] = useState({
    bankName: '',
    amount: '',
    category: '',
    date: new Date(),
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Please select an income source';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      } else {
        // Check if amount exceeds available balance
        const bankAccount = getBankAccountByName(formData.bankName);
        if (bankAccount && amount > bankAccount.balance) {
          newErrors.amount = `Amount exceeds available balance (${formatIDR(bankAccount.balance)})`;
        }
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      
      // Add transaction
      addTransaction({
        type: 'expense',
        amount,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        bankName: formData.bankName,
      });

      // Update bank account balance
      updateBankAccountBalance(formData.bankName, amount, 'expense');

      // Show success message
      if (Platform.OS === 'web') {
        alert('Expense added successfully!');
      } else {
        Alert.alert('Success', 'Expense added successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      if (Platform.OS === 'web') {
        alert('Failed to add expense. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to add expense. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const selectedBankAccount = getBankAccountByName(formData.bankName);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Expense</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={isDark ? '#F3F4F6' : '#1F2937'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Building2 size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            {' '}Income Source
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, errors.bankName && styles.inputError]}
            onPress={() => setShowBankDropdown(!showBankDropdown)}
          >
            <Text style={[styles.dropdownText, !formData.bankName && styles.placeholderText]}>
              {formData.bankName || 'Select income source'}
            </Text>
            <ChevronDown size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          
          {showBankDropdown && (
            <View style={styles.dropdownMenu}>
              {bankAccounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, bankName: account.name }));
                    setShowBankDropdown(false);
                    if (errors.bankName) {
                      setErrors(prev => ({ ...prev, bankName: '' }));
                    }
                  }}
                >
                  <View>
                    <Text style={styles.dropdownItemText}>{account.name}</Text>
                    <Text style={styles.balanceText}>Balance: {formatIDR(account.balance)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {selectedBankAccount && (
            <Text style={styles.balanceInfo}>
              Available Balance: {formatIDR(selectedBankAccount.balance)}
            </Text>
          )}
          {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <DollarSign size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            {' '}Expense Amount (IDR)
          </Text>
          <TextInput
            style={[styles.input, errors.amount && styles.inputError]}
            value={formData.amount}
            onChangeText={(text) => {
              // Only allow numbers
              const numericText = text.replace(/[^0-9]/g, '');
              setFormData(prev => ({ ...prev, amount: numericText }));
              if (errors.amount) {
                setErrors(prev => ({ ...prev, amount: '' }));
              }
            }}
            placeholder="0"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            keyboardType="numeric"
          />
          {formData.amount && (
            <Text style={styles.amountPreview}>
              {formatIDR(parseFloat(formData.amount) || 0)}
            </Text>
          )}
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expense Category</Text>
          <TouchableOpacity
            style={[styles.dropdown, errors.category && styles.inputError]}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={[styles.dropdownText, !formData.category && styles.placeholderText]}>
              {formData.category || 'Select category'}
            </Text>
            <ChevronDown size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={styles.dropdownMenu}>
              {expenseCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, category }));
                    setShowCategoryDropdown(false);
                    if (errors.category) {
                      setErrors(prev => ({ ...prev, category: '' }));
                    }
                  }}
                >
                  <Text style={styles.dropdownItemText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Calendar size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            {' '}Date
          </Text>
          <TextInput
            style={styles.input}
            value={formatDateForInput(formData.date)}
            onChangeText={handleDateChange}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, description: text }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }));
              }
            }}
            placeholder="Enter expense description"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            multiline
            numberOfLines={3}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Save Expense'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: isDark ? '#4B5563' : '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#F3F4F6' : '#1F2937',
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: isDark ? '#4B5563' : '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  placeholderText: {
    color: isDark ? '#6B7280' : '#9CA3AF',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: isDark ? '#4B5563' : '#D1D5DB',
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#4B5563' : '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  balanceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginTop: 2,
  },
  balanceInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginTop: 4,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  amountPreview: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});