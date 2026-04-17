import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export enum WalletType {
  SAVINGS = 'savings',
  CURRENT = 'current',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  MUTUAL_FUNDS = 'mutual_funds',
  STOCKS = 'stocks',
  BONDS = 'bonds',
  CASH = 'cash',
  WALLET = 'wallet',
  FIXED_DEPOSIT = 'fixed_deposit',
}

export default class Wallet extends Model {
  static table = 'wallets';

  @text('name') name!: string;
  @text('wallet_id') walletId?: string;
  @field('balance') balance!: number;
  @text('type') type!: WalletType;
  @field('invested_amount') investedAmount?: number;

}
