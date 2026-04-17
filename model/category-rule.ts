import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';

export default class CategoryRule extends Model {
  static table = 'category_rules';

  @text('merchant_name') merchantName!: string;
  @text('assigned_category') assignedCategory!: string;
}
