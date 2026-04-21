import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';

export default class Transaction extends Model {
  static table = 'transactions';

  @field('amount') amount!: number;
  @text('category') category!: string;
  @text('description') description!: string;
  @text('type') type!: string;
  @text('account_id') accountId!: string;
  @text('external_id') externalId?: string;
  @text('status') status!: string;
  @date('date') date!: Date;
  @readonly @date('created_at') createdAt!: Date;

  @relation('accounts', 'account_id') account!: any;
}
