import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddWalletForm } from '@/components/wallet/add-wallet-form';
import RecentActivity from '@/components/wallet/recent-activity';
import { WalletBalance } from '@/components/wallet/wallet-balance';
import { WalletCards } from '@/components/wallet/wallet-cards';
import { database } from '@/model';
import Wallet, { WalletType } from '@/model/wallet';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type WalletScreenProps = {
  wallets: Wallet[];
}

function WalletScreen({ wallets }: WalletScreenProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalBalance = wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const handleAddWallet = async (data: { name: string; balance: string, type: WalletType, walletId?: string }) => {
    await database.write(async () => {
      await database.collections.get<Wallet>('wallets').create((wallet) => {
        wallet.name = data.name;
        wallet.balance = parseFloat(data.balance);
        wallet.type = data.type;
        wallet.walletId = data.walletId;
      });
    });

    setIsAddModalOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <WalletBalance totalBalance={totalBalance} />
        <WalletCards wallets={wallets} onAddPress={() => setIsAddModalOpen(true)} />

        <View className="mt-4">
          <RecentActivity />
        </View>
      </ScrollView>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>
              Create a new account manually to track balances.
            </DialogDescription>
          </DialogHeader>
          <AddWalletForm
            onSubmit={handleAddWallet}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
}

const enhance = withObservables([], () => ({
  wallets: database.collections.get<Wallet>("wallets").query().observe()
}))

export default enhance(WalletScreen)