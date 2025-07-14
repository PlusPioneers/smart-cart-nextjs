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

// Enhanced product categories with realistic subcategories
const productCategories = {
  'personal_care': {
    subcategories: ['hair_care', 'skin_care', 'oral_care', 'body_care', 'fragrances'],
    brands: ['Dove', 'Pantene', 'L\'Oreal', 'Colgate', 'Pepsodent', 'Nivea', 'Garnier'],
    priceRange: { min: 50, max: 800 }
  },
  'food_beverages': {
    subcategories: ['snacks', 'beverages', 'dairy', 'frozen', 'canned_goods', 'bakery'],
    brands: ['Coca Cola', 'Pepsi', 'Nestle', 'Britannia', 'Parle', 'Amul', 'ITC'],
    priceRange: { min: 20, max: 500 }
  },
  'household': {
    subcategories: ['cleaning_supplies', 'laundry', 'paper_products', 'kitchen_essentials'],
    brands: ['Surf Excel', 'Ariel', 'Vim', 'Harpic', 'Dettol', 'Lizol'],
    priceRange: { min: 30, max: 400 }
  },
  'health_wellness': {
    subcategories: ['vitamins', 'medicines', 'first_aid', 'baby_care'],
    brands: ['Johnson & Johnson', 'Himalaya', 'Dabur', 'Patanjali', 'Revital'],
    priceRange: { min: 80, max: 1200 }
  },
  'electronics': {
    subcategories: ['mobile_accessories', 'batteries', 'cables', 'small_appliances'],
    brands: ['Samsung', 'Sony', 'Philips', 'Duracell', 'Energizer'],
    priceRange: { min: 100, max: 2000 }
  }
};

// Realistic product names by category
const productNames = {
  'hair_care': ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum', 'Hair Mask'],
  'skin_care': ['Face Wash', 'Moisturizer', 'Sunscreen', 'Face Cream', 'Body Lotion'],
  'oral_care': ['Toothpaste', 'Toothbrush', 'Mouthwash', 'Dental Floss'],
  'body_care': ['Soap', 'Body Wash', 'Deodorant', 'Talcum Powder'],
  'fragrances': ['Perfume', 'Body Spray', 'Cologne'],
  'snacks': ['Chips', 'Biscuits', 'Cookies', 'Namkeen', 'Chocolates'],
  'beverages': ['Soft Drink', 'Juice', 'Energy Drink', 'Tea', 'Coffee'],
  'dairy': ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Paneer'],
  'frozen': ['Ice Cream', 'Frozen Vegetables', 'Frozen Snacks'],
  'canned_goods': ['Canned Beans', 'Tomato Sauce', 'Pickles', 'Jam'],
  'bakery': ['Bread', 'Cake', 'Pastry', 'Muffins'],
  'cleaning_supplies': ['Detergent', 'Floor Cleaner', 'Glass Cleaner', 'Toilet Cleaner'],
  'laundry': ['Washing Powder', 'Fabric Softener', 'Stain Remover'],
  'paper_products': ['Toilet Paper', 'Tissues', 'Paper Towels'],
  'kitchen_essentials': ['Dish Soap', 'Sponges', 'Aluminum Foil', 'Plastic Wrap'],
  'vitamins': ['Multivitamin', 'Vitamin C', 'Calcium', 'Iron Tablets'],
  'medicines': ['Pain Relief', 'Cough Syrup', 'Antacid', 'Band-aids'],
  'first_aid': ['Antiseptic', 'Cotton', 'Bandages', 'Thermometer'],
  'baby_care': ['Baby Shampoo', 'Diapers', 'Baby Oil', 'Baby Powder'],
  'mobile_accessories': ['Phone Case', 'Screen Protector', 'Charger', 'Power Bank'],
  'batteries': ['AA Batteries', 'AAA Batteries', 'Rechargeable Batteries'],
  'cables': ['USB Cable', 'HDMI Cable', 'Audio Cable'],
  'small_appliances': ['Hair Dryer', 'Electric Kettle', 'Toaster', 'Mixer']
};

const paymentMethods: ('cash' | 'card' | 'digital_wallet' | 'upi')[] = [
  'cash', 'card', 'digital_wallet', 'upi'
];

const membershipLevels: ('bronze' | 'silver' | 'gold' | 'platinum')[] = [
  'bronze', 'silver', 'gold', 'platinum'
];

const storeSizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

// Generate realistic products with proper categorization
export const generateProducts = (count: number = 150): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    // Select category and subcategory
    const categoryKeys = Object.keys(productCategories);
    const mainCategory = faker.helpers.arrayElement(categoryKeys);
    const categoryData = productCategories[mainCategory as keyof typeof productCategories];
    const subcategory = faker.helpers.arrayElement(categoryData.subcategories);
    
    // Get appropriate brand and product name
    const brand = faker.helpers.arrayElement(categoryData.brands);
    const productType = faker.helpers.arrayElement(productNames[subcategory as keyof typeof productNames]);
    
    // Generate realistic product name
    const variants = ['Premium', 'Classic', 'Natural', 'Advanced', 'Pro', 'Ultra', 'Fresh'];
    const sizes = ['100ml', '200ml', '500ml', '1L', '50g', '100g', '250g', '500g', '1kg'];
    const variant = Math.random() > 0.5 ? faker.helpers.arrayElement(variants) : '';
    const size = Math.random() > 0.3 ? faker.helpers.arrayElement(sizes) : '';
    
    const productName = `${brand} ${variant} ${productType} ${size}`.trim().replace(/\s+/g, ' ');
    
    // Generate price within category range
    const price = faker.number.int({ 
      min: categoryData.priceRange.min, 
      max: categoryData.priceRange.max 
    });
    
    // Assign realistic aisle based on category
    const aisleMapping = {
      'personal_care': { min: 1, max: 3 },
      'food_beverages': { min: 4, max: 8 },
      'household': { min: 9, max: 10 },
      'health_wellness': { min: 11, max: 11 },
      'electronics': { min: 12, max: 12 }
    };
    
    const aisleRange = aisleMapping[mainCategory as keyof typeof aisleMapping];
    const aisle = faker.number.int({ min: aisleRange.min, max: aisleRange.max });
    
    const product: Product = {
      id: `prod_${faker.string.alphanumeric(8)}`,
      name: productName,
      category: mainCategory,
      subcategory: subcategory,
      brand,
      price,
      sku: `${brand.substring(0, 3).toUpperCase()}${faker.string.alphanumeric(7).toUpperCase()}`,
      description: `${productType} from ${brand}. High quality ${subcategory.replace('_', ' ')} product.`,
      imageUrl: faker.image.url({ width: 200, height: 200 }),
      location: {
        aisle,
        shelf: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']) + faker.number.int({ min: 1, max: 5 }),
        section: mainCategory
      },
      nutritionalInfo: mainCategory === 'food_beverages' ? {
        calories: faker.number.int({ min: 50, max: 500 }),
        protein: faker.number.float({ min: 0, max: 20, fractionDigits: 1 }),
        carbs: faker.number.float({ min: 0, max: 50, fractionDigits: 1 }),
        fat: faker.number.float({ min: 0, max: 30, fractionDigits: 1 })
      } : undefined,
      tags: [subcategory, brand.toLowerCase(), mainCategory],
      rating: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 10, max: 1000 }),
      inStock: faker.datatype.boolean(0.9), // 90% chance of being in stock
      discount: Math.random() > 0.7 ? faker.number.int({ min: 5, max: 30 }) : 0
    };
    
    products.push(product);
  }
  
  return products;
};

// Generate stores with realistic branch information
export const generateStores = (count: number = 25): Store[] => {
  const stores: Store[] = [];
  const storeChains = ['MegaMart', 'SuperBazaar', 'QuickShop', 'FreshMart', 'CityStore'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const areas = ['Central', 'North', 'South', 'East', 'West', 'Downtown', 'Mall Road', 'Market Street'];
  
  for (let i = 0; i < count; i++) {
    const chain = faker.helpers.arrayElement(storeChains);
    const city = faker.helpers.arrayElement(cities);
    const area = faker.helpers.arrayElement(areas);
    
    const store: Store = {
      id: `store_${faker.string.alphanumeric(8)}`,
      name: `${chain} ${area}`,
      chain: chain,
      address: faker.location.streetAddress(),
      city: city,
      area: area,
      size: faker.helpers.arrayElement(storeSizes),
      coordinates: {
        lat: faker.location.latitude({ min: 8.4, max: 37.6 }), // India bounds
        lng: faker.location.longitude({ min: 68.7, max: 97.25 })
      },
      openingHours: {
        weekdays: '9:00 AM - 10:00 PM',
        weekends: '9:00 AM - 11:00 PM'
      },
      facilities: faker.helpers.arrayElements([
        'parking', 'wheelchair_accessible', 'pharmacy', 'atm', 'food_court', 'restrooms'
      ], { min: 2, max: 5 }),
      layout: generateStoreLayout(faker.helpers.arrayElement(storeSizes))
    };
    
    stores.push(store);
  }
  
  return stores;
};

// Generate store layout based on size
const generateStoreLayout = (size: 'small' | 'medium' | 'large') => {
  const layouts = {
    small: {
      aisles: 8,
      sections: ['personal_care', 'food_beverages', 'household', 'health_wellness'],
      entrances: ['main'],
      checkouts: 3
    },
    medium: {
      aisles: 12,
      sections: ['personal_care', 'food_beverages', 'household', 'health_wellness', 'electronics'],
      entrances: ['main', 'side'],
      checkouts: 6
    },
    large: {
      aisles: 16,
      sections: ['personal_care', 'food_beverages', 'household', 'health_wellness', 'electronics'],
      entrances: ['main', 'side', 'back'],
      checkouts: 10
    }
  };
  
  return layouts[size];
};

// Generate Customers with more realistic data
export const generateCustomers = (count: number = 100): Customer[] => {
  const customers: Customer[] = [];
  
  for (let i = 0; i < count; i++) {
    const gender = faker.helpers.arrayElement(['male', 'female', 'other'] as const);
    const firstName = faker.person.firstName(gender === 'other' ? undefined : gender);
    const lastName = faker.person.lastName();
    const age = faker.number.int({ min: 18, max: 75 });
    
    // Generate shopping preferences based on age and other factors
    const preferences = generateShoppingPreferences(age, gender);
    
    const customer: Customer = {
      id: `cust_${faker.string.alphanumeric(8)}`,
      name: `${firstName} ${lastName}`,
      age,
      gender,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      membershipLevel: faker.helpers.arrayElement(membershipLevels),
      preferences,
      purchaseHistory: [],
      loyaltyPoints: faker.number.int({ min: 0, max: 5000 })
    };
    
    customers.push(customer);
  }
  
  return customers;
};

// Generate shopping preferences based on demographics
const generateShoppingPreferences = (age: number, gender: string) => {
  const basePreferences = ['food_beverages', 'personal_care'];
  
  if (age < 30) {
    basePreferences.push('electronics');
  }
  
  if (age > 40) {
    basePreferences.push('health_wellness');
  }
  
  if (gender === 'female') {
    basePreferences.push('personal_care');
  }
  
  basePreferences.push('household');
  
  return [...new Set(basePreferences)];
};

// Generate Inventory with better logic
export const generateInventory = (
  products: Product[], 
  stores: Store[], 
  count: number = 300
): Inventory[] => {
  const inventory: Inventory[] = [];
  
  for (let i = 0; i < count; i++) {
    const product = faker.helpers.arrayElement(products);
    const store = faker.helpers.arrayElement(stores);
    
    // Generate realistic stock levels based on product category
    const stockMultiplier = {
      'food_beverages': 2,
      'personal_care': 1.5,
      'household': 1.2,
      'health_wellness': 0.8,
      'electronics': 0.5
    };
    
    const multiplier = stockMultiplier[product.category as keyof typeof stockMultiplier] || 1;
    const baseStock = faker.number.int({ min: 10, max: 100 });
    const quantity = Math.floor(baseStock * multiplier);
    
    const inventoryItem: Inventory = {
      id: `inv_${faker.string.alphanumeric(8)}`,
      productId: product.id,
      storeId: store.id,
      quantity,
      location: {
        aisle: product.location.aisle,
        shelf: product.location.shelf,
        bin: faker.string.alphanumeric(3).toUpperCase(),
        section: product.location.section
      },
      lastRestocked: faker.date.recent({ days: 30 }),
      minStockLevel: Math.floor(quantity * 0.2),
      maxStockLevel: Math.floor(quantity * 3),
      supplier: faker.company.name(),
      costPrice: product.price * 0.7 // 30% markup
    };
    
    inventory.push(inventoryItem);
  }
  
  return inventory;
};

// Generate Sales Transactions with better logic
export const generateSalesTransactions = (
  products: Product[],
  stores: Store[],
  customers: Customer[],
  count: number = 500
): SalesTransaction[] => {
  const transactions: SalesTransaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const store = faker.helpers.arrayElement(stores);
    
    // Generate 1-5 items per transaction
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const items = [];
    
    for (let j = 0; j < itemCount; j++) {
      // Select products based on customer preferences
      const preferredProducts = products.filter(p => 
        customer.preferences.includes(p.category)
      );
      
      const product = preferredProducts.length > 0 
        ? faker.helpers.arrayElement(preferredProducts)
        : faker.helpers.arrayElement(products);
      
      const quantitySold = faker.number.int({ min: 1, max: 3 });
      
      items.push({
        productId: product.id,
        quantity: quantitySold,
        price: product.price,
        discount: product.discount || 0
      });
    }
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const totalDiscount = items.reduce((sum, item) => 
      sum + ((item.price * item.quantity * item.discount) / 100), 0
    );
    const tax = (subtotal - totalDiscount) * 0.18; // 18% GST
    const totalAmount = subtotal - totalDiscount + tax;
    
    const transaction: SalesTransaction = {
      transactionId: `txn_${faker.string.alphanumeric(10)}`,
      storeId: store.id,
      customerId: customer.id,
      date: faker.date.recent({ days: 90 }),
      items,
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(totalDiscount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      loyaltyPointsEarned: Math.floor(totalAmount / 10),
      cashierName: faker.person.fullName()
    };
    
    transactions.push(transaction);
  }
  
  return transactions;
};

// Generate All Mock Data
export const generateAllMockData = (): MockData => {
  console.log('🚀 Generating enhanced mock data...');
  
  const products = generateProducts(200);
  console.log(`✅ Generated ${products.length} products with realistic categorization`);
  
  const stores = generateStores(25);
  console.log(`✅ Generated ${stores.length} stores with branch information`);
  
  const customers = generateCustomers(150);
  console.log(`✅ Generated ${customers.length} customers with preferences`);
  
  const inventory = generateInventory(products, stores, 400);
  console.log(`✅ Generated ${inventory.length} inventory items`);
  
  const salesTransactions = generateSalesTransactions(products, stores, customers, 500);
  console.log(`✅ Generated ${salesTransactions.length} sales transactions`);
  
  const mockData: MockData = {
    products,
    stores,
    customers,
    inventory,
    salesTransactions
  };
  
  console.log('🎉 Enhanced mock data generation complete!');
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
    
    const dataDir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(mockData, null, 2));
    console.log(`💾 Mock data saved to ${filePath}`);
  }
};