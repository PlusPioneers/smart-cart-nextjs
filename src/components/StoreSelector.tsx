// src/components/StoreSelector.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Store } from '@/types';
import { MapPin, Clock, Users, Star, ChevronRight } from 'lucide-react';

interface StoreSelectorProps {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  onClose: () => void;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  stores,
  selectedStore,
  onStoreSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedChain, setSelectedChain] = useState('all');

  // Get unique cities and chains
  const cities = ['all', ...new Set(stores.map(store => store.city))];
  const chains = ['all', ...new Set(stores.map(store => store.chain))];

  // Filter stores
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || store.city === selectedCity;
    const matchesChain = selectedChain === 'all' || store.chain === selectedChain;
    
    return matchesSearch && matchesCity && matchesChain;
  });

  // Group stores by city
  const storesByCity = filteredStores.reduce((acc, store) => {
    if (!acc[store.city]) {
      acc[store.city] = [];
    }
    acc[store.city].push(store);
    return acc;
  }, {} as Record<string, Store[]>);

  const handleStoreSelect = (store: Store) => {
    onStoreSelect(store);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Select Store Branch</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100 mt-2">Choose your preferred store location</p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Stores
              </label>
              <input
                type="text"
                placeholder="Search by name or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Chain
              </label>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {chains.map(chain => (
                  <option key={chain} value={chain}>
                    {chain === 'all' ? 'All Chains' : chain}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Store List */}
        <div className="overflow-y-auto max-h-96">
          {Object.keys(storesByCity).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
              <p>No stores found matching your criteria</p>
            </div>
          ) : (
            Object.entries(storesByCity).map(([city, cityStores]) => (
              <div key={city} className="border-b last:border-b-0">
                <div className="bg-gray-100 px-6 py-3">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {city} ({cityStores.length} stores)
                  </h3>
                </div>
                <div className="divide-y">
                  {cityStores.map((store) => (
                    <div
                      key={store.id}
                      onClick={() => handleStoreSelect(store)}
                      className={`p-6 hover:bg-blue-50 cursor-pointer transition-colors ${
                        selectedStore?.id === store.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-800 text-lg">{store.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              store.size === 'large' ? 'bg-green-100 text-green-800' :
                              store.size === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {store.size.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-2 flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {store.address}, {store.area}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {store.openingHours.weekdays}
                            </span>
                            <span className="flex items-center">
                              <Users size={14} className="mr-1" />
                              {store.layout.checkouts} checkouts
                            </span>
                          </div>
                          
                          {/* Facilities */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {store.facilities.slice(0, 4).map((facility) => (
                              <span
                                key={facility}
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                              >
                                {facility.replace('_', ' ')}
                              </span>
                            ))}
                            {store.facilities.length > 4 && (
                              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                +{store.facilities.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="flex items-center text-yellow-500 mb-1">
                              <Star size={14} className="mr-1 fill-current" />
                              <span className="text-sm font-medium">4.{Math.floor(Math.random() * 5) + 3}</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {Math.floor(Math.random() * 500) + 100} reviews
                            </p>
                          </div>
                          <ChevronRight className="text-gray-400" size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} available
            </p>
            {selectedStore && (
              <button
                onClick={() => handleStoreSelect(selectedStore)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue with {selectedStore.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSelector;