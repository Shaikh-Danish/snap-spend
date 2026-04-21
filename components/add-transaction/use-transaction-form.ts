import { Category, database, Transaction, Wallet } from '@/model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Q } from '@nozbe/watermelondb';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { TransactionFormValues, transactionSchema } from './schema';

export const useTransactionForm = (wallets: Wallet[]) => {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: '0',
      category: '',
      type: 'expense',
      note: '',
      date: new Date(),
      accountId: wallets[0]?.id || '',
    },
  });

  useEffect(() => {
    if (wallets.length > 0 && !watch('accountId')) {
      setValue('accountId', wallets[0].id);
    }
  }, [wallets]);

  const amount = watch('amount');
  const type = watch('type');
  const categoryId = watch('category');
  const selectedDate = watch('date');
  const accountId = watch('accountId');
  const selectedWallet = wallets.find(w => w.id === accountId);

  const handleNumberPress = (num: string) => {
    let current = amount;
    if (current === '0' && num !== '.') {
      current = num;
    } else if (num === '.' && current.includes('.')) {
      // ignore
    } else {
      current += num;
    }
    setValue('amount', current, { shouldValidate: true });
  };

  const handleDeletePress = () => {
    let current = amount;
    if (current.length <= 1) {
      current = '0';
    } else {
      current = current.slice(0, -1);
    }
    setValue('amount', current, { shouldValidate: true });
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedDate || new Date(),
        mode: 'date',
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            DateTimePickerAndroid.open({
              value: date,
              mode: 'time',
              onChange: (timeEvent, timeDate) => {
                if (timeEvent.type === 'set' && timeDate) {
                  setValue('date', timeDate, { shouldValidate: true });
                }
              },
            });
          }
        },
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const onSubmit = async (values: TransactionFormValues) => {
    const finalAmount = parseFloat(values.amount);
    try {
      await database.write(async () => {
        await database.collections.get<Transaction>('transactions').create((t) => {
          t.amount = values.type === 'expense' ? -finalAmount : finalAmount;
          t.category = values.category;
          t.description = values.note || '';
          t.type = values.type;
          t.status = 'completed';
          t.accountId = values.accountId;
          t.date = values.date;
        });

        const categories = database.collections.get<Category>('categories');
        const categoryRecords = await categories.query(Q.where('name', values.category)).fetch();
        if (categoryRecords.length > 0) {
          await categoryRecords[0].update(c => {
            c.usageCount += 1;
          });
        }
      });
      router.back();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  return {
    state: {
      amount,
      type,
      categoryId,
      selectedDate,
      accountId,
      selectedWallet,
      showDatePicker,
      showWalletModal,
      errors,
    },
    actions: {
      setShowDatePicker,
      setShowWalletModal,
      setValue,
      handleNumberPress,
      handleDeletePress,
      openDatePicker,
      onSubmit: handleSubmit(onSubmit),
    },
    control,
  };
};
