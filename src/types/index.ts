// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  sku: string;
  description: string;
  imageUrl?: string;
  location: {
    aisle: number;
    shelf: string;
  };
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  size: 'small' | 'medium' | 'large';
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Inventory {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  location: {
    aisle: number;
    shelf: string;
    bin: string;
  };
  lastRestocked: Date;
  minStockLevel: number;
  maxStockLevel: number;
}

export interface SalesTransaction {
  transactionId: string;
  productId: string;
  storeId: string;
  customerId: string;
  date: Date;
  quantitySold: number;
  price: number;
  paymentMethod: 'cash' | 'card' | 'digital_wallet' | 'upi';
  discount?: number;
  tax: number;
  totalAmount: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  category: string;
  location: {
    aisle: number;
    shelf: string;
  };
}

export interface BudgetSuggestion {
  id: number;
  original: Product;
  alternative: Product;
  savings: number;
}

export interface MockData {
  products: Product[];
  stores: Store[];
  customers: Customer[];
  inventory: Inventory[];
  salesTransactions: SalesTransaction[];
}

export interface BudgetAnalysis {
  totalBudget: number;
  currentTotal: number;
  remainingBudget: number;
  budgetUtilization: number;
  isOverBudget: boolean;
  suggestions: BudgetSuggestion[];
}