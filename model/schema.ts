import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 5,
  tables: [
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'color', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'wallets',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'balance', type: 'number' },
        { name: 'type', type: 'string' },
        { name: 'wallet_id', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'description', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'category_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'wallet_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' }, // income or expense
      ],
    }),
    tableSchema({
        name: 'budgets',
        columns: [
            { name: 'amount', type: 'number' },
            { name: 'category_id', type: 'string', isIndexed: true },
            { name: 'period', type: 'string' }, // monthly, weekly
        ],
    }),
    tableSchema({
        name: 'category_rules',
        columns: [
            { name: 'pattern', type: 'string' },
            { name: 'category_id', type: 'string', isIndexed: true },
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