import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                createTable({
                    name: 'categories',
                    columns: [
                        { name: 'name', type: 'string', isIndexed: true },
                        { name: 'color', type: 'string' },
                        { name: 'icon', type: 'string' },
                        { name: 'usage_count', type: 'number' },
                    ],
                }),
            ],
        },
        {
            toVersion: 3,
            steps: [
                {
                    type: 'add_columns',
                    table: 'transactions',
                    columns: [{ name: 'date', type: 'number' }],
                },
            ],
        },
        {
            toVersion: 4,
            steps: [
                {
                    type: 'add_columns',
                    table: 'transactions',
                    columns: [{ name: 'category_id', type: 'string', isIndexed: true, isOptional: true }],
                },
            ],
        },
        {
            toVersion: 5,
            steps: [
                createTable({
                    name: 'chat_threads',
                    columns: [
                        { name: 'title', type: 'string' },
                        { name: 'created_at', type: 'number' },
                        { name: 'updated_at', type: 'number' },
                    ],
                }),
                createTable({
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
        },
        {
            toVersion: 6,
            steps: [
                {
                    type: 'add_columns',
                    table: 'transactions',
                    columns: [
                        { name: 'category', type: 'string' },
                        { name: 'account_id', type: 'string', isIndexed: true },
                        { name: 'external_id', type: 'string', isOptional: true },
                        { name: 'status', type: 'string' },
                        { name: 'created_at', type: 'number' },
                    ],
                },
                {
                    type: 'add_columns',
                    table: 'budgets',
                    columns: [
                        { name: 'amount_limit', type: 'number' },
                        { name: 'category', type: 'string' },
                        { name: 'start_date', type: 'number' },
                    ],
                },
                {
                    type: 'add_columns',
                    table: 'category_rules',
                    columns: [
                        { name: 'merchant_name', type: 'string' },
                        { name: 'assigned_category', type: 'string' },
                    ],
                },
            ],
        },
    ],
});