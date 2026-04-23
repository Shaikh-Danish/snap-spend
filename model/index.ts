import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import Budget from './budget';
import Category from './category';
import CategoryRule from './category-rule';
import ChatMessage from './chat-message';
import ChatThread from './chat-thread';
import migrations from './migrations';
import schema from './schema';
import Transaction from './transaction';
import Wallet from './wallet';

const adapter = new SQLiteAdapter({
    dbName: 'snap_spend',
    schema,
    migrations,
    jsi: true,
    onSetUpError: error => {
        console.error('Database setup error:', error);
    },
});

export const database = new Database({
    adapter,
    modelClasses: [
        Transaction, 
        Budget, 
        Wallet, 
        CategoryRule, 
        Category, 
        ChatThread, 
        ChatMessage
    ],
});

export { default as Category } from './category';
export { default as Transaction } from './transaction';
export { default as Wallet } from './wallet';
export { default as ChatThread } from './chat-thread';
export { default as ChatMessage } from './chat-message';
