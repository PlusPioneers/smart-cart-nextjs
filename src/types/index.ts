// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  sku: string;
  description: string;
  imageUrl?: string;
  location: {
    aisle: number;
    shelf: string;
    section: string;
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  discount: number;
}

export interface Store {
  id: string;
  name: string;
  chain: string;
  address: string;
  city: string;
  area: string;
  size: 'small' | 'medium' | 'large';
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours: {
    weekdays: string;
    weekends: string;
  };
  facilities: string[];
  layout: {
    aisles: number;
    sections: string[];
    entrances: string[];
    checkouts: number;
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
  preferences: string[];
  purchaseHistory: string[];
  loyaltyPoints: number;
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
    section: string;
  };
  lastRestocked: Date;
  minStockLevel: number;
  maxStockLevel: number;
  supplier: string;
  costPrice: number;
}

export interface SalesTransaction {
  transactionId: string;
  storeId: string;
  customerId: string;
  date: Date;
  items: {
    productId: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  paymentMethod: 'cash' | 'card' | 'digital_wallet' | 'upi';
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  loyaltyPointsEarned: number;
  cashierName: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  category: string;
  subcategory: string;
  location: {
    aisle: number;
    shelf: string;
    section: string;
  };
  discount: number;
}

export interface BudgetSuggestion {
  id: number;
  type: 'alternative' | 'discount' | 'bulk' | 'seasonal';
  original: Product;
  alternative?: Product;
  savings: number;
  reason: string;
  confidence: number;
}

export interface AIRecommendation {
  id: string;
  productId: string;
  type: 'frequently_bought_together' | 'similar_products' | 'trending' | 'personalized';
  score: number;
  reason: string;
  relatedProducts?: string[];
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

export interface StoreMap {
  id: string;
  storeId: string;
  layout: {
    width: number;
    height: number;
    aisles: AisleLayout[];
    sections: SectionLayout[];
    facilities: FacilityLayout[];
  };
}

export interface AisleLayout {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  category: string;
  products: string[];
}

export interface SectionLayout {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'entrance' | 'checkout' | 'customer_service' | 'pharmacy' | 'food_court';
}

export interface FacilityLayout {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'restroom' | 'atm' | 'parking' | 'elevator';
}

export interface NavigationPath {
  start: { x: number; y: number };
  end: { x: number; y: number };
  waypoints: { x: number; y: number; aisle?: number }[];
  distance: number;
  estimatedTime: number;
}