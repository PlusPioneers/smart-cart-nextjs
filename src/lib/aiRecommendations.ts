// src/lib/aiRecommendations.ts

import { Product, CartItem, Customer, SalesTransaction, AIRecommendation, BudgetSuggestion } from '@/types';

export class AIRecommendationEngine {
  private products: Product[];
  private customers: Customer[];
  private transactions: SalesTransaction[];
  private currentCustomer?: Customer;

  constructor(products: Product[], customers: Customer[], transactions: SalesTransaction[]) {
    this.products = products;
    this.customers = customers;
    this.transactions = transactions;
  }

  setCurrentCustomer(customer: Customer) {
    this.currentCustomer = customer;
  }

  // Generate personalized product recommendations
  generateRecommendations(cartItems: CartItem[], limit: number = 5): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // 1. Frequently bought together
    const frequentlyBoughtTogether = this.getFrequentlyBoughtTogether(cartItems);
    recommendations.push(...frequentlyBoughtTogether.slice(0, 2));

    // 2. Similar products (category-based)
    const similarProducts = this.getSimilarProducts(cartItems);
    recommendations.push(...similarProducts.slice(0, 2));

    // 3. Personalized recommendations based on customer preferences
    if (this.currentCustomer) {
      const personalizedRecs = this.getPersonalizedRecommendations();
      recommendations.push(...personalizedRecs.slice(0, 2));
    }

    // 4. Trending products
    const trendingProducts = this.getTrendingProducts();
    recommendations.push(...trendingProducts.slice(0, 1));

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Generate smart budget suggestions
  generateBudgetSuggestions(cartItems: CartItem[], budget: number): BudgetSuggestion[] {
    const suggestions: BudgetSuggestion[] = [];
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartTotal <= budget) return suggestions;

    // 1. Alternative products (cheaper alternatives)
    cartItems.forEach((item, index) => {
      const alternatives = this.findCheaperAlternatives(item);
      if (alternatives.length > 0) {
        const bestAlternative = alternatives[0];
        suggestions.push({
          id: Date.now() + index,
          type: 'alternative',
          original: this.getProductById(item.id)!,
          alternative: bestAlternative,
          savings: (item.price - bestAlternative.price) * item.quantity,
          reason: `Save money with a similar ${item.category} product`,
          confidence: 0.8
        });
      }
    });

    // 2. Discount suggestions
    const discountedProducts = this.getDiscountedAlternatives(cartItems);
    discountedProducts.forEach((product, index) => {
      const originalItem = cartItems.find(item => item.category === product.category);
      if (originalItem) {
        suggestions.push({
          id: Date.now() + 1000 + index,
          type: 'discount',
          original: this.getProductById(originalItem.id)!,
          alternative: product,
          savings: (originalItem.price - product.price) * originalItem.quantity,
          reason: `${product.discount}% off on ${product.name}`,
          confidence: 0.9
        });
      }
    });

    // 3. Bulk purchase suggestions
    const bulkSuggestions = this.getBulkPurchaseSuggestions(cartItems);
    suggestions.push(...bulkSuggestions);

    return suggestions
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5);
  }

  private getFrequentlyBoughtTogether(cartItems: CartItem[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const cartProductIds = cartItems.map(item => item.id);

    // Analyze transaction patterns
    const productPairs = new Map<string, number>();

    this.transactions.forEach(transaction => {
      const transactionProducts = transaction.items.map(item => item.productId);
      
      cartProductIds.forEach(cartProductId => {
        if (transactionProducts.includes(cartProductId)) {
          transactionProducts.forEach(productId => {
            if (productId !== cartProductId && !cartProductIds.includes(productId)) {
              const key = `${cartProductId}-${productId}`;
              productPairs.set(key, (productPairs.get(key) || 0) + 1);
            }
          });
        }
      });
    });

    // Convert to recommendations
    const sortedPairs = Array.from(productPairs.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    sortedPairs.forEach(([key, frequency]) => {
      const [, productId] = key.split('-');
      const product = this.getProductById(productId);
      
      if (product) {
        recommendations.push({
          id: `fbt_${productId}`,
          productId,
          type: 'frequently_bought_together',
          score: frequency / this.transactions.length,
          reason: `Customers who bought items in your cart also bought this`,
          relatedProducts: cartProductIds
        });
      }
    });

    return recommendations;
  }

  private getSimilarProducts(cartItems: CartItem[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const cartCategories = [...new Set(cartItems.map(item => item.category))];
    const cartProductIds = cartItems.map(item => item.id);

    cartCategories.forEach(category => {
      const similarProducts = this.products
        .filter(product => 
          product.category === category && 
          !cartProductIds.includes(product.id) &&
          product.inStock
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 2);

      similarProducts.forEach(product => {
        recommendations.push({
          id: `similar_${product.id}`,
          productId: product.id,
          type: 'similar_products',
          score: product.rating / 5,
          reason: `Similar to items in your cart`
        });
      });
    });

    return recommendations;
  }

  private getPersonalizedRecommendations(): AIRecommendation[] {
    if (!this.currentCustomer) return [];

    const recommendations: AIRecommendation[] = [];
    const preferences = this.currentCustomer.preferences;

    preferences.forEach(category => {
      const categoryProducts = this.products
        .filter(product => 
          product.category === category && 
          product.inStock &&
          product.rating >= 4.0
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 1);

      categoryProducts.forEach(product => {
        recommendations.push({
          id: `personalized_${product.id}`,
          productId: product.id,
          type: 'personalized',
          score: 0.7,
          reason: `Based on your shopping preferences`
        });
      });
    });

    return recommendations;
  }

  private getTrendingProducts(): AIRecommendation[] {
    // Calculate trending products based on recent sales
    const recentTransactions = this.transactions
      .filter(t => {
        const daysDiff = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      });

    const productSales = new Map<string, number>();
    
    recentTransactions.forEach(transaction => {
      transaction.items.forEach(item => {
        productSales.set(item.productId, (productSales.get(item.productId) || 0) + item.quantity);
      });
    });

    const trendingProductIds = Array.from(productSales.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([productId]) => productId);

    return trendingProductIds.map(productId => {
      const product = this.getProductById(productId);
      if (product) {
        return {
          id: `trending_${productId}`,
          productId,
          type: 'trending' as const,
          score: 0.6,
          reason: 'Trending this month'
        };
      }
      return null;
    }).filter(Boolean) as AIRecommendation[];
  }

  private findCheaperAlternatives(cartItem: CartItem): Product[] {
    return this.products
      .filter(product => 
        product.category === cartItem.category &&
        product.subcategory === cartItem.subcategory &&
        product.price < cartItem.price &&
        product.id !== cartItem.id &&
        product.inStock
      )
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);
  }

  private getDiscountedAlternatives(cartItems: CartItem[]): Product[] {
    const cartCategories = cartItems.map(item => item.category);
    
    return this.products
      .filter(product => 
        cartCategories.includes(product.category) &&
        product.discount > 0 &&
        product.inStock
      )
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 3);
  }

  private getBulkPurchaseSuggestions(cartItems: CartItem[]): BudgetSuggestion[] {
    const suggestions: BudgetSuggestion[] = [];

    cartItems.forEach((item, index) => {
      if (item.quantity === 1) {
        const product = this.getProductById(item.id);
        if (product && ['food_beverages', 'household'].includes(product.category)) {
          const bulkSavings = product.price * 0.1; // 10% savings for bulk
          suggestions.push({
            id: Date.now() + 2000 + index,
            type: 'bulk',
            original: product,
            savings: bulkSavings,
            reason: `Buy 3 or more for 10% off`,
            confidence: 0.7
          });
        }
      }
    });

    return suggestions;
  }

  private getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  // Calculate recommendation score based on multiple factors
  calculateRecommendationScore(
    product: Product,
    cartItems: CartItem[],
    customer?: Customer
  ): number {
    let score = 0;

    // Base score from product rating
    score += (product.rating / 5) * 0.3;

    // Category preference score
    if (customer && customer.preferences.includes(product.category)) {
      score += 0.3;
    }

    // Price compatibility score
    const avgCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0) / cartItems.length;
    const priceRatio = Math.min(product.price / avgCartPrice, 2);
    score += (2 - priceRatio) * 0.2;

    // Stock availability
    if (product.inStock) {
      score += 0.1;
    }

    // Discount bonus
    if (product.discount > 0) {
      score += (product.discount / 100) * 0.1;
    }

    return Math.min(score, 1);
  }
}

// Utility function to create AI engine instance
export const createAIEngine = (
  products: Product[],
  customers: Customer[],
  transactions: SalesTransaction[]
): AIRecommendationEngine => {
  return new AIRecommendationEngine(products, customers, transactions);
};