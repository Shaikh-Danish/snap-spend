import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';

export default class Transaction extends Model {
  static table = 'transactions';

  static associations = {
    categories: { type: 'belongs_to' as const, key: 'category_id' },
    accounts: { type: 'belongs_to' as const, key: 'account_id' },
  };

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
  @text('category_id') categoryId!: string;
  @relation('categories', 'category_id') categoryRel!: Relation<any>;
}
