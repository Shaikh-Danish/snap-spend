import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import Budget from './budget';
import CategoryRule from './category-rule';
import migrations from './migrations';
import schema from './schema';
import Transaction from './transaction';
import Wallet from './wallet';

const adapter = new SQLiteAdapter({
    dbName: 'snap_spend',
    schema,
    migrations,
    jsi: false,
    onSetUpError: error => {
        console.log(error);
    },
});

export const database = new Database({
    adapter,
    modelClasses: [Transaction, Budget, Wallet, CategoryRule],
});