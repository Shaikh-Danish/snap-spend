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

import { Platform, NativeModules } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const hasNativeModule = !!NativeModules.WatermelonDB;

if (isExpoGo) {
    console.warn(
        '⚠️ WatermelonDB Warning: You are running in Expo Go. ' +
        'WatermelonDB REQUIRES a Development Build (custom dev client) to function. ' +
        'Please run `pnpm android` and use the installed "SnapSpend" app instead.'
    );
}

const adapter = new SQLiteAdapter({
    dbName: 'snap_spend',
    schema,
    migrations,
    // only enabled JSI if we are NOT in Expo Go and have the native module
    jsi: !isExpoGo && hasNativeModule, 
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
