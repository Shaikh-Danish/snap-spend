import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 6,
  tables: [
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'icon', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'usage_count', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'wallets',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'balance', type: 'number' },
        { name: 'type', type: 'string' },
        { name: 'wallet_id', type: 'string', isOptional: true },
        { name: 'invested_amount', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'category', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'category_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' }, // income or expense
        { name: 'external_id', type: 'string', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
        name: 'budgets',
        columns: [
            { name: 'amount', type: 'number' },
            { name: 'amount_limit', type: 'number' },
            { name: 'category_id', type: 'string', isIndexed: true },
            { name: 'category', type: 'string' },
            { name: 'period', type: 'string' }, // monthly, weekly
            { name: 'start_date', type: 'number' },
        ],
    }),
    tableSchema({
        name: 'category_rules',
        columns: [
            { name: 'pattern', type: 'string' },
            { name: 'merchant_name', type: 'string' },
            { name: 'category_id', type: 'string', isIndexed: true },
            { name: 'assigned_category', type: 'string' },
        ],
    }),
    tableSchema({
      name: 'chat_threads',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'chat_messages',
      columns: [
        { name: 'thread_id', type: 'string', isIndexed: true },
        { name: 'role', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'status', type: 'string', isOptional: true },
      ],
    }),
  ],
});