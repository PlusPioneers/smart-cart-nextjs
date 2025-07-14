// src/hooks/useCart.ts

import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product, BudgetSuggestion, Store, Customer, SalesTransaction, AIRecommendation } from '@/types';
import { createAIEngine } from '@/lib/aiRecommendations';

interface UseCartReturn {
  cart: CartItem[];
  budget: number;
  cartTotal: number;
  budgetLeft: number;
  totalSaved: number;
  budgetUtilization: number;
  isOverBudget: boolean;
  suggestions: BudgetSuggestion[];
  recommendations: AIRecommendation[];
  selectedStore: Store | null;
  setBudget: (budget: number) => void;
  setSelectedStore: (store: Store) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  acceptSuggestion: (suggestionId: number) => void;
  dismissSuggestion: (suggestionId: number) => void;
  loadMockData: () => Promise<void>;
  mockProducts: Product[];
  mockStores: Store[];
  mockCustomers: Customer[];
  mockTransactions: SalesTransaction[];
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [budget, setBudget] = useState<number>(1000);
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mockProducts, setMockProducts] = useState<Product[]>([]);
  const [mockStores, setMockStores] = useState<Store[]>([]);
  const [mockCustomers, setMockCustomers] = useState<Customer[]>([]);
  const [mockTransactions, setMockTransactions] = useState<SalesTransaction[]>([]);

  // Load mock data on component mount
  const loadMockData = useCallback(async () => {
    try {
      const response = await fetch('/api/mock-data');
      const result = await response.json();
      
      if (result.success) {
        setMockProducts(result.data.products);
        setMockStores(result.data.stores);
        setMockCustomers(result.data.customers);
        setMockTransactions(result.data.salesTransactions);
        console.log('Mock data loaded:', result.summary);
      }
    } catch (error) {
      console.error('Failed to load mock data:', error);
    }
  }, []);

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  // Calculate derived values
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const budgetLeft = budget - cartTotal;
  const totalSaved = cart.reduce((sum, item) => 
    sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0
  );
  const budgetUtilization = (cartTotal / budget) * 100;
  const isOverBudget = cartTotal > budget;

  // Update AI recommendations when cart changes
  useEffect(() => {
    if (mockProducts.length > 0 && mockCustomers.length > 0 && mockTransactions.length > 0) {
      const aiEngine = createAIEngine(mockProducts, mockCustomers, mockTransactions);
      
      // Set a sample customer for personalized recommendations
      const sampleCustomer = mockCustomers[0];
      aiEngine.setCurrentCustomer(sampleCustomer);
      
      // Generate recommendations
      const newRecommendations = aiEngine.generateRecommendations(cart, 5);
      setRecommendations(newRecommendations);
      
      // Generate budget suggestions if over budget
      if (isOverBudget) {
        const budgetSuggestions = aiEngine.generateBudgetSuggestions(cart, budget);
        setSuggestions(budgetSuggestions);
      } else {
        setSuggestions([]);
      }
    }
  }, [cart, budget, isOverBudget, mockProducts, mockCustomers, mockTransactions]);

  // Add product to cart
  const addToCart = useCallback((product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        subcategory: product.subcategory,
        location: product.location,
        discount: product.discount
      };
      
      setCart(prevCart => [...prevCart, newCartItem]);
    }
  }, [cart]);

  // Remove product from cart
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
    setSuggestions([]);
    setRecommendations([]);
  }, []);

  // Accept suggestion
  const acceptSuggestion = useCallback((suggestionId: number) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion || !suggestion.alternative) return;

    const alternativeWithSavings: CartItem = {
      id: suggestion.alternative.id,
      name: suggestion.alternative.name,
      price: suggestion.alternative.price,
      originalPrice: suggestion.original.price,
      quantity: 1,
      category: suggestion.alternative.category,
      subcategory: suggestion.alternative.subcategory,
      location: suggestion.alternative.location,
      discount: suggestion.alternative.discount
    };

    // Remove original item and add alternative
    setCart(prevCart => {
      const filteredCart = prevCart.filter(item => item.id !== suggestion.original.id);
      return [...filteredCart, alternativeWithSavings];
    });
    
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, [suggestions]);

  // Dismiss suggestion
  const dismissSuggestion = useCallback((suggestionId: number) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  return {
    cart,
    budget,
    cartTotal,
    budgetLeft,
    totalSaved,
    budgetUtilization,
    isOverBudget,
    suggestions,
    recommendations,
    selectedStore,
    setBudget,
    setSelectedStore,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    acceptSuggestion,
    dismissSuggestion,
    loadMockData,
    mockProducts,
    mockStores,
    mockCustomers,
    mockTransactions
  };
};