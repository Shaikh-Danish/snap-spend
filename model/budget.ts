import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class Budget extends Model {
  static table = 'budgets';

  @text('category') category!: string;
  @field('amount_limit') amountLimit!: number;
  @text('period') period!: string;
  @field('start_date') startDate!: number;
}
