import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 4,
    tables: [
        tableSchema({
            name: 'categories',
            columns: [
                { name: 'name', type: 'string', isIndexed: true },
                { name: 'color', type: 'string' },
                { name: 'icon', type: 'string' },
                { name: 'usage_count', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'wallets',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'wallet_id', type: 'string', isOptional: true },
                { name: 'balance', type: 'number' },
                { name: 'type', type: 'string' },
                { name: 'invested_amount', type: 'number', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'transactions',
            columns: [
                { name: 'amount', type: 'number' },
                { name: 'category', type: 'string', isIndexed: true },
                { name: 'description', type: 'string' },
                { name: 'type', type: 'string' },
                { name: 'account_id', type: 'string', isIndexed: true },
                { name: 'category_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // To prevent duplicates
                { name: 'status', type: 'string' }, // 'pending_ai', 'confirmed', 'excluded'
                { name: 'date', type: 'number' },
                { name: 'created_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'budgets',
            columns: [
                { name: 'category', type: 'string', isIndexed: true },
                { name: 'amount_limit', type: 'number' },
                { name: 'period', type: 'string' }, // 'monthly', 'weekly'
                { name: 'start_date', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'category_rules',
            columns: [
                { name: 'merchant_name', type: 'string', isIndexed: true },
                { name: 'assigned_category', type: 'string' }, // e.g., 'Food'
            ],
        }),
    ]
})