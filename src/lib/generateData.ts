// src/lib/generateData.ts

import { faker } from '@faker-js/faker';
import { 
  Product, 
  Store, 
  Customer, 
  Inventory, 
  SalesTransaction, 
  MockData 
} from '@/types';

// Product categories and related data
const productCategories = [
  'shampoo', 'conditioner', 'soap', 'toothpaste', 'toothbrush', 
  'deodorant', 'moisturizer', 'sunscreen', 'perfume', 'makeup',
  'snacks', 'beverages', 'dairy', 'frozen', 'canned_goods',
  'cleaning_supplies', 'laundry', 'paper_products', 'baby_care',
  'vitamins', 'medicines', 'first_aid'
];

const brands = [
  'Dove', 'Pantene', 'L\'Oreal', 'Colgate', 'Pepsodent', 'Lux',
  'Dettol', 'Lifebuoy', 'Head & Shoulders', 'Clinic Plus',
  'Garnier', 'Nivea', 'Lakme', 'Maybelline', 'Olay',
  'Coca Cola', 'Pepsi', 'Nestle', 'Britannia', 'Parle',
  'Amul', 'ITC', 'Hindustan Unilever', 'Procter & Gamble'
];

const paymentMethods: ('cash' | 'card' | 'digital_wallet' | 'upi')[] = [
  'cash', 'card', 'digital_wallet', 'upi'
];

const membershipLevels: ('bronze' | 'silver' | 'gold' | 'platinum')[] = [
  'bronze', 'silver', 'gold', 'platinum'
];

const storeSizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

// Generate Products
export const generateProducts = (count: number = 100): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(productCategories);
    const brand = faker.helpers.arrayElement(brands);
    const productName = `${brand} ${faker.commerce.productName()}`;
    
    const product: Product = {
      id: `prod_${faker.string.alphanumeric(8)}`,
      name: productName,
      category,
      brand,
      price: parseFloat(faker.commerce.price({ min: 25, max: 500, dec: 0 })),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      description: faker.commerce.productDescription(),
      imageUrl: faker.image.url({ width: 200, height: 200 }),
      location: {
        aisle: faker.number.int({ min: 1, max: 12 }),
        shelf: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']) + faker.number.int({ min: 1, max: 5 })
      }
    };
    
    products.push(product);
  }
  
  return products;
};

// Generate Stores
export const generateStores = (count: number = 50): Store[] => {
  const stores: Store[] = [];
  
  for (let i = 0; i < count; i++) {
    const store: Store = {
      id: `store_${faker.string.alphanumeric(8)}`,
      name: `${faker.company.name()} ${faker.helpers.arrayElement(['Mall', 'Super Market', 'Store', 'Bazaar'])}`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      size: faker.helpers.arrayElement(storeSizes),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude()
      }
    };
    
    stores.push(store);
  }
  
  return stores;
};

// Generate Customers
export const generateCustomers = (count: number = 200): Customer[] => {
  const customers: Customer[] = [];
  
  for (let i = 0; i < count; i++) {
    const gender = faker.helpers.arrayElement(['male', 'female', 'other'] as const);
    const firstName = faker.person.firstName(gender === 'other' ? undefined : gender);
    const lastName = faker.person.lastName();
    
    const customer: Customer = {
      id: `cust_${faker.string.alphanumeric(8)}`,
      name: `${firstName} ${lastName}`,
      age: faker.number.int({ min: 18, max: 75 }),
      gender,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      membershipLevel: faker.helpers.arrayElement(membershipLevels)
    };
    
    customers.push(customer);
  }
  
  return customers;
};

// Generate Inventory
export const generateInventory = (
  products: Product[], 
  stores: Store[], 
  count: number = 300
): Inventory[] => {
  const inventory: Inventory[] = [];
  
  for (let i = 0; i < count; i++) {
    const product = faker.helpers.arrayElement(products);
    const store = faker.helpers.arrayElement(stores);
    
    const inventoryItem: Inventory = {
      id: `inv_${faker.string.alphanumeric(8)}`,
      productId: product.id,
      storeId: store.id,
      quantity: faker.number.int({ min: 0, max: 500 }),
      location: {
        aisle: product.location.aisle,
        shelf: product.location.shelf,
        bin: faker.string.alphanumeric(3).toUpperCase()
      },
      lastRestocked: faker.date.recent({ days: 30 }),
      minStockLevel: faker.number.int({ min: 10, max: 50 }),
      maxStockLevel: faker.number.int({ min: 100, max: 1000 })
    };
    
    inventory.push(inventoryItem);
  }
  
  return inventory;
};

// Generate Sales Transactions
export const generateSalesTransactions = (
  products: Product[],
  stores: Store[],
  customers: Customer[],
  count: number = 500
): SalesTransaction[] => {
  const transactions: SalesTransaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const product = faker.helpers.arrayElement(products);
    const store = faker.helpers.arrayElement(stores);
    const customer = faker.helpers.arrayElement(customers);
    const quantitySold = faker.number.int({ min: 1, max: 5 });
    const discount = faker.number.int({ min: 0, max: 20 });
    const tax = 0.18; // 18% GST
    const subtotal = product.price * quantitySold;
    const discountAmount = (subtotal * discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * tax);
    const totalAmount = subtotal - discountAmount + taxAmount;
    
    const transaction: SalesTransaction = {
      transactionId: `txn_${faker.string.alphanumeric(10)}`,
      productId: product.id,
      storeId: store.id,
      customerId: customer.id,
      date: faker.date.recent({ days: 90 }),
      quantitySold,
      price: product.price,
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      discount,
      tax: parseFloat(taxAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2))
    };
    
    transactions.push(transaction);
  }
  
  return transactions;
};

// Generate All Mock Data
export const generateAllMockData = (): MockData => {
  console.log('🚀 Generating mock data...');
  
  const products = generateProducts(150);
  console.log(`✅ Generated ${products.length} products`);
  
  const stores = generateStores(25);
  console.log(`✅ Generated ${stores.length} stores`);
  
  const customers = generateCustomers(100);
  console.log(`✅ Generated ${customers.length} customers`);
  
  const inventory = generateInventory(products, stores, 200);
  console.log(`✅ Generated ${inventory.length} inventory items`);
  
  const salesTransactions = generateSalesTransactions(products, stores, customers, 300);
  console.log(`✅ Generated ${salesTransactions.length} sales transactions`);
  
  const mockData: MockData = {
    products,
    stores,
    customers,
    inventory,
    salesTransactions
  };
  
  console.log('🎉 Mock data generation complete!');
  console.log('📊 Data Summary:', {
    products: products.length,
    stores: stores.length,
    customers: customers.length,
    inventory: inventory.length,
    salesTransactions: salesTransactions.length
  });
  
  return mockData;
};

// Save data to JSON file (for Node.js environment)
export const saveMockDataToFile = async (mockData: MockData, filename: string = 'mockData.json'): Promise<void> => {
  if (typeof window === 'undefined') {
    // This will only run on the server side
    const fs = await import('fs');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), 'src/data', filename);
    fs.writeFileSync(filePath, JSON.stringify(mockData, null, 2));
    console.log(`💾 Mock data saved to ${filePath}`);
  }
};

// Budget Analysis Functions
export const analyzeBudget = (
  cartItems: { id: string; price: number; quantity: number }[],
  budget: number,
  allProducts: Product[]
): {
  totalBudget: number;
  currentTotal: number;
  remainingBudget: number;
  budgetUtilization: number;
  isOverBudget: boolean;
  suggestions: Array<{
    original: Product;
    alternative: Product;
    savings: number;
  }>;
} => {
  const currentTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remainingBudget = budget - currentTotal;
  const budgetUtilization = (currentTotal / budget) * 100;
  const isOverBudget = currentTotal > budget;
  
  // Find cheaper alternatives
  const suggestions = cartItems
    .map(cartItem => {
      const currentProduct = allProducts.find(p => p.id === cartItem.id);
      if (!currentProduct) return null;
      
      const alternatives = allProducts.filter(p => 
        p.category === currentProduct.category &&
        p.price < currentProduct.price &&
        p.id !== currentProduct.id
      );
      
      if (alternatives.length === 0) return null;
      
      const bestAlternative = alternatives.reduce((best, current) => 
        current.price < best.price ? current : best
      );
      
      return {
        original: currentProduct,
        alternative: bestAlternative,
        savings: (currentProduct.price - bestAlternative.price) * cartItem.quantity
      };
    })
    .filter(Boolean)
    .slice(0, 3); // Top 3 suggestions
  
  return {
    totalBudget: budget,
    currentTotal,
    remainingBudget,
    budgetUtilization: parseFloat(budgetUtilization.toFixed(2)),
    isOverBudget,
    suggestions: suggestions as Array<{
      original: Product;
      alternative: Product;
      savings: number;
    }>
  };
};