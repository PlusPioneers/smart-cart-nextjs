// src/scripts/generateMockData.ts

import { generateAllMockData, saveMockDataToFile } from '../lib/generateData';

async function main() {
  console.log('🚀 Starting mock data generation...');
  
  try {
    // Generate all mock data
    const mockData = generateAllMockData();
    
    // Save to file
    await saveMockDataToFile(mockData);
    
    console.log('✅ Mock data generation completed successfully!');
    console.log('📁 Data saved to src/data/mockData.json');
    
    // Log sample data
    console.log('\n📊 Sample Products:');
    mockData.products.slice(0, 3).forEach(product => {
      console.log(`  - ${product.name} (${product.brand}) - ₹${product.price}`);
    });
    
    console.log('\n🏪 Sample Stores:');
    mockData.stores.slice(0, 3).forEach(store => {
      console.log(`  - ${store.name} (${store.city})`);
    });
    
    console.log('\n👥 Sample Customers:');
    mockData.customers.slice(0, 3).forEach(customer => {
      console.log(`  - ${customer.name} (${customer.age}yo, ${customer.membershipLevel})`);
    });
    
    console.log('\n📋 Summary:');
    console.log(`  Products: ${mockData.products.length}`);
    console.log(`  Stores: ${mockData.stores.length}`);
    console.log(`  Customers: ${mockData.customers.length}`);
    console.log(`  Inventory Items: ${mockData.inventory.length}`);
    console.log(`  Sales Transactions: ${mockData.salesTransactions.length}`);
    
  } catch (error) {
    console.error('❌ Error generating mock data:', error);
    process.exit(1);
  }
}

// Run the script
main();