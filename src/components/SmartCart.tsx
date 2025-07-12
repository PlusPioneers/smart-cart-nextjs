// src/components/SmartCart.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  MapPin, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Plus, 
  Minus, 
  TrendingDown,
  Loader2,
  Trash2,
  DollarSign,
  Package,
  Users,
  Store,
  BarChart3
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';

const SmartCart: React.FC = () => {
  const {
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
    mockProducts
  } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState<'budget' | 'shopping'>('budget');
  const [highlightedAisle, setHighlightedAisle] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...new Set(mockProducts.map(p => p.category))];

  // Filter products by search term and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Generate mock data button handler
  const handleGenerateMockData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mock-data?save=true');
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Mock data generated and saved!');
        console.log('📊 Summary:', result.summary);
        // The useCart hook will automatically reload the data
      }
    } catch (error) {
      console.error('❌ Failed to generate mock data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Budget Setup Step
  if (currentStep === 'budget') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingCart className="mx-auto mb-4 text-blue-600" size={48} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Smart Cart</h1>
            <p className="text-gray-600 mb-6">Set your shopping budget to get started</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount (₹)
              </label>
              <input
                type="number"
                value={budget === 0 ? '' : budget}
                onChange={(e) => {
                  const val = e.target.value;
                  setBudget(val === '' ? 0 : Math.max(0, Number(val)));
                }}
                className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-center text-xl font-bold text-blue-900 placeholder-blue-400 bg-white shadow"
                placeholder="Enter your budget"
              />
            </div>

            <div className="mb-6">
              <button
                onClick={handleGenerateMockData}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Generating Data...
                  </>
                ) : (
                  'Generate Mock Data'
                )}
              </button>
              <p className="text-xs text-gray-500 mb-4">
                Click to generate fresh mock data with products, stores, and customers
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('shopping')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Shopping Interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-800">Smart Cart</h1>
            </div>
            <button
              onClick={() => setCurrentStep('budget')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Change Budget
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-blue-900 placeholder-blue-400 font-semibold bg-white shadow"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-blue-900 font-semibold bg-white shadow"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product: Product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <p className="text-xs text-gray-500 capitalize">{product.category.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-1" />
                        Aisle {product.location.aisle}, {product.location.shelf}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Plus size={16} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            )}
          </div>

          {/* Right Column - Cart and Budget */}
          <div className="space-y-6">
            {/* Budget Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-blue-700 font-semibold">Budget:</span>
                  <span className="font-bold text-blue-900">₹{budget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 font-semibold">Cart Total:</span>
                  <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 font-semibold">Remaining:</span>
                  <span className={`font-bold ${budgetLeft < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{budgetLeft.toFixed(2)}</span>
                </div>
                {totalSaved > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-semibold">Total Saved:</span>
                    <span className="font-bold text-green-700">₹{totalSaved.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Budget Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Budget Usage</span>
                  <span>{budgetUtilization.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budgetUtilization > 100 ? 'bg-red-500' : 
                      budgetUtilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
                {isOverBudget && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    Over budget by ₹{Math.abs(budgetLeft).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Budget Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <TrendingDown size={18} className="mr-2" />
                  Budget Suggestions
                </h3>
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white rounded-lg p-3 mb-3 last:mb-0">
                    <p className="text-sm text-gray-700 mb-2">
                      Consider <strong>{suggestion.alternative.name}</strong> instead of{' '}
                      <strong>{suggestion.original.name}</strong>
                    </p>
                    <p className="text-sm text-green-600 font-medium mb-3">
                      Save ₹{suggestion.savings.toFixed(2)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptSuggestion(suggestion.id)}
                        className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => dismissSuggestion(suggestion.id)}
                        className="flex-1 bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-400 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Shopping Cart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Shopping Cart</h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                  >
                    <Trash2 size={14} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          ₹{item.price.toFixed(2)} {item.originalPrice && (
                            <span className="line-through text-gray-400">₹{item.originalPrice.toFixed(2)}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Aisle {item.location.aisle}, {item.location.shelf}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-blue-100 rounded hover:bg-blue-200 transition-colors text-blue-700 border border-blue-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-blue-900 bg-blue-50 rounded px-2 py-1 border border-blue-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-blue-100 rounded hover:bg-blue-200 transition-colors text-blue-700 border border-blue-300"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors ml-2"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Data Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Package className="mx-auto text-blue-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-800">{mockProducts.length}</p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
                <div className="text-center">
                  <Store className="mx-auto text-green-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-800">25</p>
                  <p className="text-sm text-gray-600">Stores</p>
                </div>
                <div className="text-center">
                  <Users className="mx-auto text-purple-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-800">100</p>
                  <p className="text-sm text-gray-600">Customers</p>
                </div>
                <div className="text-center">
                  <BarChart3 className="mx-auto text-orange-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-800">300</p>
                  <p className="text-sm text-gray-600">Transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCart;