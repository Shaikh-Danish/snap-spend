import { database } from '.';
import Wallet, { WalletType } from './wallet';

export const seedAccounts = async () => {
  const walletsCollection = database.collections.get<Wallet>('wallets');

  // Check if we already have wallets
  const count = await walletsCollection.query().fetchCount();
  if (count > 0) {
    console.log('Database already has wallets, skipping seed.');
    return;
  }

  console.log('Seeding initial wallets...');

  await database.write(async () => {
    await walletsCollection.create((wallet) => {
      wallet.name = 'HDFC Bank';
      wallet.walletId = '8291';
      wallet.balance = 45250.50;
      wallet.type = WalletType.SAVINGS;
    });

    await walletsCollection.create((wallet) => {
      wallet.name = 'ICICI Bank';
      wallet.walletId = '4412';
      wallet.balance = 120800.00;
      wallet.type = WalletType.SAVINGS;
    });

    await walletsCollection.create((wallet) => {
      wallet.name = 'Amazon Pay';
      wallet.walletId = 'AMZN';
      wallet.balance = 2450.00;
      wallet.type = WalletType.WALLET;
    });

    await walletsCollection.create((wallet) => {
      wallet.name = 'SBI Credit Card';
      wallet.walletId = '1004';
      wallet.balance = -15400.00;
      wallet.type = WalletType.CREDIT_CARD;
    });
  });

  console.log('Seeding complete!');
};

