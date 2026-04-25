import { AddWalletForm } from '@/components/wallet/add-wallet-form';
import { WalletBalance } from '@/components/wallet/wallet-balance';
import { WalletCards } from '@/components/wallet/wallet-cards';
import WalletSpendSummary from '@/components/wallet/wallet-spend-summary';
import { database } from '@/model';
import Wallet from '@/model/wallet';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type WalletScreenProps = {
  wallets: Wallet[];
}

function WalletScreen({ wallets }: WalletScreenProps) {
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalBalance = wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingWallet(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <WalletBalance totalBalance={totalBalance} />
        <WalletCards
          wallets={wallets}
          onAddPress={() => setIsAddModalOpen(true)}
          onEditPress={(wallet) => setEditingWallet(wallet)}
        />

        <View className="mt-2">
          <WalletSpendSummary />
        </View>
      </ScrollView>

      {(isAddModalOpen || editingWallet) && (
        <AddWalletForm
          initialWallet={editingWallet || undefined}
          onCancel={handleCloseModal}
        />
      )}
    </SafeAreaView>
  );
}

const enhance = withObservables([], () => ({
  wallets: database.collections.get<Wallet>("wallets").query().observe()
}))

export default enhance(WalletScreen)