// src/components/StoreMap.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Store, Product, NavigationPath } from '@/types';
import { createNavigationSystem } from '@/lib/storeNavigation';
import { MapPin, Navigation, Clock, Route, X, Zap } from 'lucide-react';

interface StoreMapProps {
  store: Store;
  cartProducts: Product[];
  onClose: () => void;
}

const StoreMap: React.FC<StoreMapProps> = ({ store, cartProducts, onClose }) => {
  const [navigationSystem] = useState(() => createNavigationSystem(store));
  const [shoppingPath, setShoppingPath] = useState<NavigationPath | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPath, setShowPath] = useState(false);

  const storeMap = navigationSystem.getStoreMap();

  useEffect(() => {
    if (cartProducts.length > 0) {
      const path = navigationSystem.generateShoppingPath(cartProducts);
      setShoppingPath(path);
    }
  }, [cartProducts, navigationSystem]);

  const handleGeneratePath = () => {
    if (shoppingPath) {
      setShowPath(true);
      setCurrentPosition(shoppingPath.start);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'personal_care': '#8B5CF6',
      'food_beverages': '#10B981',
      'household': '#F59E0B',
      'health_wellness': '#EF4444',
      'electronics': '#3B82F6',
      'general': '#6B7280'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getSectionColor = (type: string) => {
    const colors = {
      'entrance': '#059669',
      'checkout': '#DC2626',
      'customer_service': '#7C3AED',
      'pharmacy': '#DB2777',
      'food_court': '#EA580C'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{store.name} - Store Map</h2>
              <p className="text-blue-100 mt-1">{store.address}, {store.area}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-120px)]">
          {/* Map Area */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="relative bg-gray-100 rounded-lg p-4" style={{ minHeight: '500px' }}>
              {/* SVG Map */}
              <svg
                width={storeMap.layout.width}
                height={storeMap.layout.height}
                viewBox={`0 0 ${storeMap.layout.width} ${storeMap.layout.height}`}
                className="border border-gray-300 rounded bg-white"
              >
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Aisles */}
                {storeMap.layout.aisles.map((aisle) => (
                  <g key={aisle.id}>
                    <rect
                      x={aisle.x}
                      y={aisle.y}
                      width={aisle.width}
                      height={aisle.height}
                      fill={getCategoryColor(aisle.category)}
                      stroke="#374151"
                      strokeWidth="2"
                      rx="4"
                      opacity="0.8"
                    />
                    <text
                      x={aisle.x + aisle.width / 2}
                      y={aisle.y + aisle.height / 2 - 5}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white"
                    >
                      Aisle {aisle.id}
                    </text>
                    <text
                      x={aisle.x + aisle.width / 2}
                      y={aisle.y + aisle.height / 2 + 8}
                      textAnchor="middle"
                      className="text-xs fill-white"
                    >
                      {aisle.category.replace('_', ' ')}
                    </text>
                  </g>
                ))}

                {/* Sections */}
                {storeMap.layout.sections.map((section) => (
                  <g key={section.id}>
                    <rect
                      x={section.x}
                      y={section.y}
                      width={section.width}
                      height={section.height}
                      fill={getSectionColor(section.type)}
                      stroke="#1F2937"
                      strokeWidth="2"
                      rx="4"
                    />
                    <text
                      x={section.x + section.width / 2}
                      y={section.y + section.height / 2}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white"
                    >
                      {section.name}
                    </text>
                  </g>
                ))}

                {/* Facilities */}
                {storeMap.layout.facilities.map((facility) => (
                  <g key={facility.id}>
                    <rect
                      x={facility.x}
                      y={facility.y}
                      width={facility.width}
                      height={facility.height}
                      fill="#9CA3AF"
                      stroke="#4B5563"
                      strokeWidth="1"
                      rx="2"
                    />
                    <text
                      x={facility.x + facility.width / 2}
                      y={facility.y + facility.height / 2}
                      textAnchor="middle"
                      className="text-xs fill-white"
                    >
                      {facility.name}
                    </text>
                  </g>
                ))}

                {/* Shopping Path */}
                {showPath && shoppingPath && (
                  <g>
                    {/* Path lines */}
                    {shoppingPath.waypoints.map((waypoint, index) => {
                      if (index === 0) return null;
                      const prev = shoppingPath.waypoints[index - 1];
                      return (
                        <line
                          key={index}
                          x1={prev.x}
                          y1={prev.y}
                          x2={waypoint.x}
                          y2={waypoint.y}
                          stroke="#DC2626"
                          strokeWidth="3"
                          strokeDasharray="5,5"
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    })}
                    
                    {/* Arrow marker */}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#DC2626"
                        />
                      </marker>
                    </defs>

                    {/* Waypoints */}
                    {shoppingPath.waypoints.map((waypoint, index) => (
                      <circle
                        key={index}
                        cx={waypoint.x}
                        cy={waypoint.y}
                        r="6"
                        fill={index === 0 ? "#059669" : index === shoppingPath.waypoints.length - 1 ? "#DC2626" : "#F59E0B"}
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))}
                  </g>
                )}

                {/* Current Position */}
                {currentPosition && (
                  <circle
                    cx={currentPosition.x}
                    cy={currentPosition.y}
                    r="8"
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <animate
                      attributeName="r"
                      values="8;12;8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </svg>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-gray-50 p-6 overflow-y-auto">
            {/* Store Info */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Store Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium capitalize">{store.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aisles:</span>
                  <span className="font-medium">{store.layout.aisles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Checkouts:</span>
                  <span className="font-medium">{store.layout.checkouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours:</span>
                  <span className="font-medium text-xs">{store.openingHours.weekdays}</span>
                </div>
              </div>
            </div>

            {/* Shopping Path Info */}
            {shoppingPath && (
              <div className="bg-white rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Route className="mr-2" size={16} />
                  Shopping Route
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">{shoppingPath.distance}m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Est. Time:</span>
                    <span className="font-medium">{shoppingPath.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Stops:</span>
                    <span className="font-medium">{cartProducts.length} items</span>
                  </div>
                  
                  <button
                    onClick={handleGeneratePath}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Navigation size={16} />
                    <span>Show Navigation</span>
                  </button>
                </div>
              </div>
            )}

            {/* Shopping List */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Shopping List</h3>
              {cartProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">No items in cart</p>
              ) : (
                <div className="space-y-2">
                  {cartProducts.map((product, index) => {
                    const aisle = navigationSystem.getProductAisle(product);
                    return (
                      <div key={product.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-gray-500">
                            Aisle {product.location.aisle}, {product.location.shelf}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Map Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Personal Care</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Food & Beverages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Household</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Health & Wellness</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Electronics</span>
                </div>
                <hr className="my-2" />
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span>Entrance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span>Checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span>Facilities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;