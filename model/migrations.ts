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
    ],
});