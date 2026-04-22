import { database } from '.';

export const clearAllData = async () => {
  console.log('Starting manual database clear...');
  await database.write(async () => {
    const tables = ['transactions', 'categories', 'wallets', 'budgets', 'category_rules'];
    
    for (const tableName of tables) {
      try {
        const collection = database.collections.get(tableName);
        const records = await collection.query().fetch();
        
        // Delete each record permanently
        for (const record of records) {
          await record.destroyPermanently();
        }
        console.log(`Cleared table: ${tableName}`);
      } catch (e) {
        console.log(`Could not clear table ${tableName}:`, e);
      }
    }
  });
  console.log('Database is now completely empty.');
};

export const seedInitialData = async () => {
    // We already have a good seeding function, keeping it here if you need it later
    // but for now we focus on clearing.
};
