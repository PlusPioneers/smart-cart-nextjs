// src/components/StoreSelector.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Store } from '@/types';
import { MapPin, Clock, Users, Star, ChevronRight, Search, Filter } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Select Store Branch</h2>
              <p className="text-blue-100 mt-2 text-base">Choose your preferred store location</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-3xl font-bold transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-500"
            >
              ×
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center mb-4">
            <Filter className="text-gray-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Filter Stores</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Search Stores
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium bg-white"
              >
                {cities.map(city => (
                  <option key={city} value={city} className="text-gray-800 font-medium">
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Store Chain
              </label>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium bg-white"
              >
                {chains.map(chain => (
                  <option key={chain} value={chain} className="text-gray-800 font-medium">
                    {chain === 'all' ? 'All Chains' : chain}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Store List */}
        <div className="overflow-y-auto max-h-[50vh]">
          {Object.keys(storesByCity).length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <MapPin className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-lg font-medium text-gray-600">No stores found matching your criteria</p>
              <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            Object.entries(storesByCity).map(([city, cityStores]) => (
              <div key={city} className="border-b last:border-b-0">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center">
                    <MapPin size={20} className="mr-3 text-blue-600" />
                    {city} ({cityStores.length} store{cityStores.length !== 1 ? 's' : ''})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {cityStores.map((store) => (
                    <div
                      key={store.id}
                      onClick={() => handleStoreSelect(store)}
                      className={`p-6 hover:bg-blue-50 cursor-pointer transition-all duration-200 ${
                        selectedStore?.id === store.id ? 'bg-blue-100 border-l-4 border-blue-600 shadow-md' : 'hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="font-bold text-gray-900 text-xl">{store.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              store.size === 'large' ? 'bg-green-100 text-green-800' :
                              store.size === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {store.size.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3 flex items-center font-medium">
                            <MapPin size={16} className="mr-2 text-gray-500" />
                            {store.address}, {store.area}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center font-medium">
                              <Clock size={16} className="mr-2 text-gray-500" />
                              {store.openingHours.weekdays}
                            </span>
                            <span className="flex items-center font-medium">
                              <Users size={16} className="mr-2 text-gray-500" />
                              {store.layout.checkouts} checkouts
                            </span>
                          </div>
                          
                          {/* Facilities */}
                          <div className="flex flex-wrap gap-2">
                            {store.facilities.slice(0, 4).map((facility) => (
                              <span
                                key={facility}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium"
                              >
                                {facility.replace('_', ' ')}
                              </span>
                            ))}
                            {store.facilities.length > 4 && (
                              <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                                +{store.facilities.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center text-yellow-500 mb-1">
                              <Star size={16} className="mr-1 fill-current" />
                              <span className="text-sm font-bold text-gray-800">4.{Math.floor(Math.random() * 5) + 3}</span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                              {Math.floor(Math.random() * 500) + 100} reviews
                            </p>
                          </div>
                          <ChevronRight className="text-gray-400" size={24} />
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
            <p className="text-sm text-gray-700 font-medium">
              {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} available
            </p>
            {selectedStore && (
              <button
                onClick={() => handleStoreSelect(selectedStore)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
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