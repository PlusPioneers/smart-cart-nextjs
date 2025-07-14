// src/lib/storeNavigation.ts

import { Store, StoreMap, AisleLayout, SectionLayout, FacilityLayout, NavigationPath, Product } from '@/types';

export class StoreNavigationSystem {
  private storeMap: StoreMap;
  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.storeMap = this.generateStoreMap(store);
  }

  // Generate store map based on store layout
  private generateStoreMap(store: Store): StoreMap {
    const { layout } = store;
    const mapWidth = store.size === 'large' ? 800 : store.size === 'medium' ? 600 : 400;
    const mapHeight = store.size === 'large' ? 600 : store.size === 'medium' ? 450 : 300;

    // Generate aisles
    const aisles: AisleLayout[] = [];
    const aisleWidth = 60;
    const aisleHeight = 120;
    const aislesPerRow = Math.ceil(Math.sqrt(layout.aisles));
    const spacing = 20;

    for (let i = 0; i < layout.aisles; i++) {
      const row = Math.floor(i / aislesPerRow);
      const col = i % aislesPerRow;
      
      const x = 100 + col * (aisleWidth + spacing);
      const y = 100 + row * (aisleHeight + spacing);

      // Assign category based on aisle number
      const categoryMapping = {
        1: 'personal_care', 2: 'personal_care', 3: 'personal_care',
        4: 'food_beverages', 5: 'food_beverages', 6: 'food_beverages', 7: 'food_beverages', 8: 'food_beverages',
        9: 'household', 10: 'household',
        11: 'health_wellness',
        12: 'electronics'
      };

      aisles.push({
        id: i + 1,
        x,
        y,
        width: aisleWidth,
        height: aisleHeight,
        category: categoryMapping[(i + 1) as keyof typeof categoryMapping] || 'general',
        products: []
      });
    }

    // Generate sections (entrances, checkouts, etc.)
    const sections: SectionLayout[] = [
      // Main entrance
      { id: 'entrance_main', name: 'Main Entrance', x: 50, y: mapHeight - 80, width: 80, height: 40, type: 'entrance' },
      // Checkouts
      { id: 'checkout_1', name: 'Checkout 1', x: 50, y: 50, width: 40, height: 30, type: 'checkout' },
      { id: 'checkout_2', name: 'Checkout 2', x: 100, y: 50, width: 40, height: 30, type: 'checkout' },
      { id: 'checkout_3', name: 'Checkout 3', x: 150, y: 50, width: 40, height: 30, type: 'checkout' },
      // Customer service
      { id: 'customer_service', name: 'Customer Service', x: mapWidth - 120, y: 50, width: 80, height: 40, type: 'customer_service' }
    ];

    // Add more checkouts for larger stores
    if (layout.checkouts > 3) {
      for (let i = 4; i <= layout.checkouts; i++) {
        sections.push({
          id: `checkout_${i}`,
          name: `Checkout ${i}`,
          x: 50 + ((i - 1) % 6) * 50,
          y: 50 + Math.floor((i - 1) / 6) * 40,
          width: 40,
          height: 30,
          type: 'checkout'
        });
      }
    }

    // Add side entrance for medium/large stores
    if (layout.entrances.includes('side')) {
      sections.push({
        id: 'entrance_side',
        name: 'Side Entrance',
        x: mapWidth - 50,
        y: mapHeight / 2,
        width: 40,
        height: 80,
        type: 'entrance'
      });
    }

    // Generate facilities
    const facilities: FacilityLayout[] = [];
    
    if (store.facilities.includes('restrooms')) {
      facilities.push({
        id: 'restrooms',
        name: 'Restrooms',
        x: mapWidth - 100,
        y: mapHeight - 100,
        width: 60,
        height: 40,
        type: 'restroom'
      });
    }

    if (store.facilities.includes('atm')) {
      facilities.push({
        id: 'atm',
        name: 'ATM',
        x: 200,
        y: 50,
        width: 30,
        height: 20,
        type: 'atm'
      });
    }

    return {
      id: `map_${store.id}`,
      storeId: store.id,
      layout: {
        width: mapWidth,
        height: mapHeight,
        aisles,
        sections,
        facilities
      }
    };
  }

  // Find optimal path through store for shopping list
  generateShoppingPath(products: Product[]): NavigationPath {
    const productLocations = products.map(product => ({
      product,
      aisle: this.storeMap.layout.aisles.find(a => a.id === product.location.aisle)
    })).filter(item => item.aisle);

    // Sort by aisle number for efficient path
    productLocations.sort((a, b) => a.aisle!.id - b.aisle!.id);

    const waypoints: { x: number; y: number; aisle?: number }[] = [];
    
    // Start at main entrance
    const entrance = this.storeMap.layout.sections.find(s => s.id === 'entrance_main');
    if (entrance) {
      waypoints.push({ x: entrance.x + entrance.width / 2, y: entrance.y });
    }

    // Add waypoints for each aisle
    productLocations.forEach(({ aisle }) => {
      if (aisle) {
        waypoints.push({
          x: aisle.x + aisle.width / 2,
          y: aisle.y + aisle.height / 2,
          aisle: aisle.id
        });
      }
    });

    // End at checkout
    const checkout = this.storeMap.layout.sections.find(s => s.type === 'checkout');
    if (checkout) {
      waypoints.push({ x: checkout.x + checkout.width / 2, y: checkout.y });
    }

    // Calculate total distance and estimated time
    let totalDistance = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      totalDistance += Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    }

    // Estimate time (assuming 50 pixels = 1 meter, walking speed = 1.4 m/s)
    const estimatedTime = Math.ceil((totalDistance / 50) / 1.4 / 60); // in minutes

    return {
      start: waypoints[0],
      end: waypoints[waypoints.length - 1],
      waypoints,
      distance: Math.round(totalDistance / 50), // in meters
      estimatedTime
    };
  }

  // Get store map for rendering
  getStoreMap(): StoreMap {
    return this.storeMap;
  }

  // Find nearest facility
  findNearestFacility(currentPosition: { x: number; y: number }, facilityType: string): FacilityLayout | null {
    const facilities = this.storeMap.layout.facilities.filter(f => f.type === facilityType);
    
    if (facilities.length === 0) return null;

    return facilities.reduce((nearest, facility) => {
      const currentDistance = Math.sqrt(
        Math.pow(facility.x - currentPosition.x, 2) + 
        Math.pow(facility.y - currentPosition.y, 2)
      );
      
      const nearestDistance = Math.sqrt(
        Math.pow(nearest.x - currentPosition.x, 2) + 
        Math.pow(nearest.y - currentPosition.y, 2)
      );

      return currentDistance < nearestDistance ? facility : nearest;
    });
  }

  // Get aisle information for a product
  getProductAisle(product: Product): AisleLayout | null {
    return this.storeMap.layout.aisles.find(aisle => aisle.id === product.location.aisle) || null;
  }

  // Check if store has specific facility
  hasFacility(facilityType: string): boolean {
    return this.store.facilities.includes(facilityType);
  }
}

// Utility function to create navigation system
export const createNavigationSystem = (store: Store): StoreNavigationSystem => {
  return new StoreNavigationSystem(store);
};

// Generate sample store layouts for different store sizes
export const generateSampleStoreLayouts = () => {
  const layouts = {
    small: {
      aisles: 8,
      sections: ['personal_care', 'food_beverages', 'household', 'health_wellness'],
      entrances: ['main'],
      checkouts: 3,
      facilities: ['restrooms', 'atm']
    },
    medium: {
      aisles: 12,
      sections: ['personal_care', 'food_beverages', 'household', 'health_wellness', 'electronics'],
      entrances: ['main', 'side'],
      checkouts: 6,
      facilities: ['restrooms', 'atm', 'pharmacy']
    },
    large: {
      aisles: 16,
      sections: ['personal_care', 'food_beverages', 'household', 'health_wellness', 'electronics'],
      entrances: ['main', 'side', 'back'],
      checkouts: 10,
      facilities: ['restrooms', 'atm', 'pharmacy', 'food_court']
    }
  };

  return layouts;
};