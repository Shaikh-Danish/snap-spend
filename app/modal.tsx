import React from 'react';
import { View } from 'react-native';

import { AddTransactionForm } from '@/components/add-transaction/add-transaction-form';

export default function ModalScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AddTransactionForm />
    </View>
  );
}
