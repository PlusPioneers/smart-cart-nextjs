// src/hooks/useCart.ts

import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product, BudgetSuggestion } from '@/types';

interface UseCartReturn {
  cart: CartItem[];
  budget: number;
  cartTotal: number;
  budgetLeft: number;
  totalSaved: number;
  budgetUtilization: number;
  isOverBudget: boolean;
  suggestions: BudgetSuggestion[];
  setBudget: (budget: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  acceptSuggestion: (suggestionId: number) => void;
  dismissSuggestion: (suggestionId: number) => void;
  loadMockData: () => Promise<void>;
  mockProducts: Product[];
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [budget, setBudget] = useState<number>(1000);
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [mockProducts, setMockProducts] = useState<Product[]>([]);

  // Load mock data on component mount
  const loadMockData = useCallback(async () => {
    try {
      const response = await fetch('/api/mock-data');
      const result = await response.json();
      
      if (result.success) {
        setMockProducts(result.data.products);
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

  // Find cheaper alternative
  const findCheaperAlternative = useCallback((product: Product): Product | null => {
    return mockProducts.find(p => 
      p.category === product.category && 
      p.price < product.price && 
      p.id !== product.id &&
      !cart.some(cartItem => cartItem.id === p.id)
    ) || null;
  }, [mockProducts, cart]);

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
      // Check if we should suggest an alternative
      const alternative = findCheaperAlternative(product);
      
      if (alternative && (cartTotal + product.price > budget * 0.8)) {
        const newSuggestion: BudgetSuggestion = {
          id: Date.now(),
          original: product,
          alternative: alternative,
          savings: product.price - alternative.price
        };
        setSuggestions(prev => [...prev, newSuggestion]);
        return;
      }

      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        location: product.location
      };
      
      setCart(prevCart => [...prevCart, newCartItem]);
    }
  }, [cart, cartTotal, budget, findCheaperAlternative]);

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
  }, []);

  // Accept suggestion
  const acceptSuggestion = useCallback((suggestionId: number) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    const alternativeWithSavings: CartItem = {
      id: suggestion.alternative.id,
      name: suggestion.alternative.name,
      price: suggestion.alternative.price,
      originalPrice: suggestion.original.price,
      quantity: 1,
      category: suggestion.alternative.category,
      location: suggestion.alternative.location
    };

    setCart(prevCart => [...prevCart, alternativeWithSavings]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, [suggestions]);

  // Dismiss suggestion
  const dismissSuggestion = useCallback((suggestionId: number) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    const originalProduct: CartItem = {
      id: suggestion.original.id,
      name: suggestion.original.name,
      price: suggestion.original.price,
      quantity: 1,
      category: suggestion.original.category,
      location: suggestion.original.location
    };

    setCart(prevCart => [...prevCart, originalProduct]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, [suggestions]);

  return {
    cart,
    budget,
    cartTotal,
    budgetLeft,
    totalSaved,
    budgetUtilization,
    isOverBudget,
    suggestions,
    setBudget,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    acceptSuggestion,
    dismissSuggestion,
    loadMockData,
    mockProducts
  };
};