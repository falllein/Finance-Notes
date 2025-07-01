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
import { Calendar, DollarSign, Building2, Save, X } from 'lucide-react-native';

interface IncomeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ onClose, onSuccess }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const { bankAccounts, addBankAccount, updateBankAccountBalance } = useBankAccounts();
  const { addTransaction } = useTransactions();

  const [formData, setFormData] = useState({
    bankName: '',
    amount: '',
    date: new Date(),
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
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
      
      // Check if bank account exists, if not create it
      let bankAccount = bankAccounts.find(acc => acc.name === formData.bankName);
      if (!bankAccount) {
        bankAccount = addBankAccount(formData.bankName);
      }

      // Add transaction
      addTransaction({
        type: 'income',
        amount,
        category: 'Income',
        description: formData.description,
        date: formData.date,
        bankName: formData.bankName,
      });

      // Update bank account balance
      updateBankAccountBalance(formData.bankName, amount, 'income');

      // Show success message
      if (Platform.OS === 'web') {
        alert('Income added successfully!');
      } else {
        Alert.alert('Success', 'Income added successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      if (Platform.OS === 'web') {
        alert('Failed to add income. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to add income. Please try again.');
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Income</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={isDark ? '#F3F4F6' : '#1F2937'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Building2 size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            {' '}Bank Name
          </Text>
          <TextInput
            style={[styles.input, errors.bankName && styles.inputError]}
            value={formData.bankName}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, bankName: text }));
              if (errors.bankName) {
                setErrors(prev => ({ ...prev, bankName: '' }));
              }
            }}
            placeholder="Enter bank name (e.g., BCA - Savings)"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          />
          {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <DollarSign size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            {' '}Income Amount (IDR)
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
            placeholder="Enter income description"
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
            {isSubmitting ? 'Saving...' : 'Save Income'}
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
    color: '#10B981',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#10B981',
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