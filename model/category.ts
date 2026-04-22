import { Model, Query } from '@nozbe/watermelondb'
import { children, field, text } from '@nozbe/watermelondb/decorators'

export default class Category extends Model {
    static table = 'categories'

    // We must define associations here for @children to work
    static associations = {
      transactions: { type: 'has_many' as const, foreignKey: 'category_id' },
    };

    @text('name') name!: string
    @text('color') color!: string
    @text('icon') icon!: string
    @field('usage_count') usageCount!: number

    @children('transactions') transactions!: Query<any>;
}
