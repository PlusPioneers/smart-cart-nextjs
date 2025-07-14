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
  BarChart3,
  Map,
  Navigation,
  Sparkles,
  Star,
  ThumbsUp,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import StoreSelector from './StoreSelector';
import StoreMap from './StoreMap';

const SmartCart: React.FC = () => {
  // Collapsible states for mobile
  const [showBudget, setShowBudget] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showCart, setShowCart] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Modal states
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [showStoreMap, setShowStoreMap] = useState(false);

  // Responsive state: mobile or desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setShowBudget(false);
      setShowSuggestions(false);
      setShowCart(false);
      setShowRecommendations(false);
    } else {
      setShowBudget(true);
      setShowSuggestions(true);
      setShowCart(true);
      setShowRecommendations(true);
    }
  }, [isMobile]);

  const {
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
    mockProducts,
    mockStores
  } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState<'budget' | 'store' | 'shopping'>('budget');
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

  // Get cart products for map navigation
  const cartProducts = cart.map(item => 
    mockProducts.find(p => p.id === item.id)
  ).filter(Boolean) as Product[];

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

  // Add recommended product to cart
  const handleAddRecommendation = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  // Budget Setup Step
  if (currentStep === 'budget') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Cart</h1>
            <p className="text-gray-600 mb-8 text-lg">Set your shopping budget to get started</p>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Budget Amount (₹)
              </label>
              <input
                type="number"
                value={budget === 0 ? '' : budget}
                onChange={(e) => {
                  const val = e.target.value;
                  setBudget(val === '' ? 0 : Math.max(0, Number(val)));
                }}
                className="w-full px-6 py-4 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-center text-2xl font-bold text-blue-900 placeholder-blue-400 bg-blue-50 shadow-sm transition-all duration-200"
                placeholder="Enter your budget"
              />
            </div>

            <div className="mb-8">
              <button
                onClick={handleGenerateMockData}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Generating Data...
                  </>
                ) : (
                  'Generate Mock Data'
                )}
              </button>
              <p className="text-sm text-gray-600 mb-4">
                Click to generate fresh mock data with products, stores, and customers
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('store')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Store Selection Step
  if (currentStep === 'store') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Store className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Store</h1>
            <p className="text-gray-600 mb-8 text-lg">Choose your preferred store location</p>
            
            {selectedStore ? (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-blue-900 text-lg">{selectedStore.name}</h3>
                <p className="text-blue-700 text-sm font-medium">{selectedStore.address}, {selectedStore.area}</p>
                <p className="text-blue-700 text-sm font-medium">{selectedStore.city}</p>
              </div>
            ) : (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-600 font-medium">No store selected</p>
              </div>
            )}

            <button
              onClick={() => setShowStoreSelector(true)}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 mb-6 shadow-lg hover:shadow-xl"
            >
              {selectedStore ? 'Change Store' : 'Select Store'}
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep('budget')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-bold hover:bg-gray-300 transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('shopping')}
                disabled={!selectedStore}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>

        {showStoreSelector && (
          <StoreSelector
            stores={mockStores}
            selectedStore={selectedStore}
            onStoreSelect={setSelectedStore}
            onClose={() => setShowStoreSelector(false)}
          />
        )}
      </div>
    );
  }

  // Main Shopping Interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Cart</h1>
                {selectedStore && (
                  <p className="text-sm text-gray-600 font-medium">{selectedStore.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {selectedStore && cartProducts.length > 0 && (
                <button
                  onClick={() => setShowStoreMap(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  <Map size={16} />
                  <span>Store Map</span>
                </button>
              )}
              <button
                onClick={() => setCurrentStep('store')}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Change Store
              </button>
              <button
                onClick={() => setCurrentStep('budget')}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Change Budget
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Responsive layout for summary/suggestions/cart */}
        {isMobile ? (
          <div className="space-y-4 mb-8">
            {/* Budget Summary (collapsible) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                className="w-full flex justify-between items-center px-6 py-4 font-bold text-blue-800 focus:outline-none"
                onClick={() => setShowBudget((v) => !v)}
                aria-expanded={showBudget}
              >
                <span className="text-lg">Budget Summary</span>
                {showBudget ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showBudget && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-bold">Budget:</span>
                      <span className="font-bold text-blue-900">₹{budget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-bold">Cart Total:</span>
                      <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-bold">Remaining:</span>
                      <span className={`font-bold ${budgetLeft < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{budgetLeft.toFixed(2)}</span>
                    </div>
                    {totalSaved > 0 && (
                      <div className="flex justify-between">
                        <span className="text-blue-700 font-bold">Total Saved:</span>
                        <span className="font-bold text-green-700">₹{totalSaved.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  {/* Budget Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-700 mb-2 font-medium">
                      <span>Budget Usage</span>
                      <span>{budgetUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          budgetUtilization > 100 ? 'bg-red-500' :
                          budgetUtilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                      ></div>
                    </div>
                    {isOverBudget && (
                      <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                        <AlertTriangle size={16} className="mr-2" />
                        Over budget by ₹{Math.abs(budgetLeft).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Recommendations (collapsible) */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
              <button
                className="w-full flex justify-between items-center px-6 py-4 font-bold text-purple-800 focus:outline-none"
                onClick={() => setShowRecommendations((v) => !v)}
                aria-expanded={showRecommendations}
                disabled={recommendations.length === 0}
              >
                <span className="flex items-center text-lg"><Sparkles size={20} className="mr-2" />AI Recommendations</span>
                {showRecommendations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showRecommendations && recommendations.length > 0 && (
                <div className="px-6 pb-6">
                  {recommendations.map((rec) => {
                    const product = mockProducts.find(p => p.id === rec.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={rec.id} className="bg-white rounded-xl p-4 mb-4 last:mb-0 shadow-sm border border-purple-100">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-700 font-medium">₹{product.price}</p>
                            <p className="text-xs text-purple-700 mt-1 font-medium">{rec.reason}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center text-yellow-500">
                              <Star size={14} className="fill-current" />
                              <span className="text-xs ml-1 font-bold text-gray-800">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddRecommendation(rec.productId)}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold"
                        >
                          Add to Cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Budget Suggestions (collapsible) */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
              <button
                className="w-full flex justify-between items-center px-6 py-4 font-bold text-yellow-800 focus:outline-none"
                onClick={() => setShowSuggestions((v) => !v)}
                aria-expanded={showSuggestions}
                disabled={suggestions.length === 0}
              >
                <span className="flex items-center text-lg"><TrendingDown size={20} className="mr-2" />Budget Suggestions</span>
                {showSuggestions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <div className="px-6 pb-6">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white rounded-xl p-4 mb-4 last:mb-0 shadow-sm border border-yellow-100">
                      <p className="text-sm text-gray-800 mb-2 font-medium">
                        {suggestion.type === 'alternative' && suggestion.alternative && (
                          <>Consider <strong>{suggestion.alternative.name}</strong> instead of{' '}
                          <strong>{suggestion.original.name}</strong></>
                        )}
                        {suggestion.type === 'discount' && suggestion.alternative && (
                          <>Get <strong>{suggestion.alternative.name}</strong> with {suggestion.alternative.discount}% off</>
                        )}
                        {suggestion.type === 'bulk' && (
                          <>Buy more <strong>{suggestion.original.name}</strong> for bulk savings</>
                        )}
                      </p>
                      <p className="text-sm text-green-600 font-bold mb-3">
                        Save ₹{suggestion.savings.toFixed(2)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => acceptSuggestion(suggestion.id)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-3 rounded-lg text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => dismissSuggestion(suggestion.id)}
                          className="flex-1 bg-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm hover:bg-gray-400 transition-all duration-200 font-semibold"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart (collapsible) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                className="w-full flex justify-between items-center px-6 py-4 font-bold text-gray-900 focus:outline-none"
                onClick={() => setShowCart((v) => !v)}
                aria-expanded={showCart}
              >
                <span className="text-lg">Shopping Cart ({cart.length})</span>
                {showCart ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showCart && (
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1 font-semibold"
                      >
                        <Trash2 size={16} />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="mx-auto text-gray-400 mb-3" size={40} />
                      <p className="text-gray-600 font-medium">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-700 font-medium">
                              ₹{item.price.toFixed(2)} {item.originalPrice && (
                                <span className="line-through text-gray-500">₹{item.originalPrice.toFixed(2)}</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-600 font-medium">
                              Aisle {item.location.aisle}, {item.location.shelf}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors text-blue-700 border border-blue-300"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-bold text-blue-900 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors text-blue-700 border border-blue-300"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-600 hover:text-red-700 transition-colors ml-2"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Budget Summary (card) */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col border border-gray-200">
              <h2 className="font-bold text-blue-800 mb-4 text-lg">Budget Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-blue-700 font-bold">Budget:</span>
                  <span className="font-bold text-blue-900">₹{budget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 font-bold">Cart Total:</span>
                  <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 font-bold">Remaining:</span>
                  <span className={`font-bold ${budgetLeft < 0 ? 'text-red-600' : 'text-green-600'}`}>₹{budgetLeft.toFixed(2)}</span>
                </div>
                {totalSaved > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-bold">Total Saved:</span>
                    <span className="font-bold text-green-700">₹{totalSaved.toFixed(2)}</span>
                  </div>
                )}
              </div>
              {/* Budget Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-700 mb-2 font-medium">
                  <span>Budget Usage</span>
                  <span>{budgetUtilization.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      budgetUtilization > 100 ? 'bg-red-500' :
                      budgetUtilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  ></div>
                </div>
                {isOverBudget && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <AlertTriangle size={16} className="mr-2" />
                    Over budget by ₹{Math.abs(budgetLeft).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* AI Recommendations (card) */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 flex flex-col">
              <h2 className="font-bold text-purple-800 mb-4 text-lg flex items-center"><Sparkles size={20} className="mr-2" />AI Recommendations</h2>
              {recommendations.length === 0 ? (
                <p className="text-gray-600 font-medium">No recommendations available</p>
              ) : (
                <div className="space-y-4">
                  {recommendations.slice(0, 2).map((rec) => {
                    const product = mockProducts.find(p => p.id === rec.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={rec.id} className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
                            <p className="text-sm text-gray-700 font-medium">₹{product.price}</p>
                            <p className="text-xs text-purple-700 mt-1 font-medium">{rec.reason}</p>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <Star size={14} className="fill-current" />
                            <span className="text-xs ml-1 font-bold text-gray-800">{product.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddRecommendation(rec.productId)}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-3 rounded-lg text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold"
                        >
                          Add to Cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Budget Suggestions (card) */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 flex flex-col">
              <h2 className="font-bold text-yellow-800 mb-4 text-lg flex items-center"><TrendingDown size={20} className="mr-2" />Budget Suggestions</h2>
              {suggestions.length === 0 ? (
                <p className="text-gray-600 font-medium">No suggestions available</p>
              ) : (
                <div className="space-y-4">
                  {suggestions.slice(0, 2).map((suggestion) => (
                    <div key={suggestion.id} className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100">
                      <p className="text-sm text-gray-800 mb-2 font-medium">
                        {suggestion.type === 'alternative' && suggestion.alternative && (
                          <>Consider <strong>{suggestion.alternative.name}</strong> instead</>
                        )}
                        {suggestion.type === 'discount' && suggestion.alternative && (
                          <>{suggestion.alternative.discount}% off available</>
                        )}
                        {suggestion.type === 'bulk' && (
                          <>Bulk savings available</>
                        )}
                      </p>
                      <p className="text-sm text-green-600 font-bold mb-3">
                        Save ₹{suggestion.savings.toFixed(2)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => acceptSuggestion(suggestion.id)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-3 rounded-lg text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => dismissSuggestion(suggestion.id)}
                          className="flex-1 bg-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm hover:bg-gray-400 transition-all duration-200 font-semibold"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart (card) */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">Shopping Cart ({cart.length})</h2>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto text-gray-400 mb-3" size={40} />
                  <p className="text-gray-600 font-medium">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-700 font-medium">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors text-blue-700"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-blue-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors text-blue-700"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-sm text-gray-600 text-center font-medium">+{cart.length - 3} more items</p>
                  )}
                </div>
              )}
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="mt-4 text-red-600 hover:text-red-700 text-sm flex items-center space-x-1 self-end font-semibold"
                >
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Filter className="text-gray-600 mr-2" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Search & Filter Products</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-blue-900 placeholder-blue-400 font-semibold bg-blue-50 shadow-sm transition-all duration-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-blue-900 font-semibold bg-blue-50 shadow-sm transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category} value={category} className="text-gray-800 font-medium">
                  {category === 'all' ? 'All Categories' : category.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-700 font-medium">{product.brand}</p>
                    <p className="text-xs text-gray-600 capitalize font-medium">{product.subcategory?.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold text-green-600">₹{product.price}</p>
                      {product.discount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                          {product.discount}% off
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-yellow-500 mt-2">
                      <Star size={14} className="fill-current" />
                      <span className="text-xs ml-1 font-bold text-gray-800">{product.rating}</span>
                      <span className="text-xs text-gray-500 ml-1 font-medium">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <MapPin size={16} className="mr-1" />
                    Aisle {product.location.aisle}, {product.location.shelf}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                  >
                    <Plus size={16} />
                    <span>{product.inStock ? 'Add' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg font-medium">No products found matching your search.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Data Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-6 text-xl">Data Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Package className="text-blue-600" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{mockProducts.length}</p>
              <p className="text-sm text-gray-600 font-medium">Products</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Store className="text-green-600" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{mockStores.length}</p>
              <p className="text-sm text-gray-600 font-medium">Stores</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="text-purple-600" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">150</p>
              <p className="text-sm text-gray-600 font-medium">Customers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="text-orange-600" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">500</p>
              <p className="text-sm text-gray-600 font-medium">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showStoreSelector && (
        <StoreSelector
          stores={mockStores}
          selectedStore={selectedStore}
          onStoreSelect={setSelectedStore}
          onClose={() => setShowStoreSelector(false)}
        />
      )}

      {showStoreMap && selectedStore && (
        <StoreMap
          store={selectedStore}
          cartProducts={cartProducts}
          onClose={() => setShowStoreMap(false)}
        />
      )}
    </div>
  );
};

export default SmartCart;