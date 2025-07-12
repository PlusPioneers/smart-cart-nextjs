// src/app/api/mock-data/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateAllMockData, saveMockDataToFile } from '@/lib/generateData';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API: Generating mock data...');
    
    // Generate all mock data
    const mockData = generateAllMockData();
    
    // Check if we should save to file
    const { searchParams } = new URL(request.url);
    const shouldSave = searchParams.get('save') === 'true';
    
    if (shouldSave) {
      await saveMockDataToFile(mockData);
    }
    
    // Create summary for response
    const summary = {
      products: mockData.products.length,
      stores: mockData.stores.length,
      customers: mockData.customers.length,
      inventory: mockData.inventory.length,
      salesTransactions: mockData.salesTransactions.length,
      totalRecords: mockData.products.length + 
                   mockData.stores.length + 
                   mockData.customers.length + 
                   mockData.inventory.length + 
                   mockData.salesTransactions.length
    };
    
    console.log('✅ API: Mock data generated successfully');
    console.log('📊 API Summary:', summary);
    
    return NextResponse.json({
      success: true,
      message: 'Mock data generated successfully',
      data: mockData,
      summary: summary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to generate mock data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Handle POST requests for different data generation scenarios
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productCount = 150, 
      storeCount = 25, 
      customerCount = 100,
      inventoryCount = 200,
      transactionCount = 300 
    } = body;
    
    console.log('🚀 API POST: Generating custom mock data...');
    console.log('📝 Counts:', { productCount, storeCount, customerCount, inventoryCount, transactionCount });
    
    // You could modify generateAllMockData to accept these parameters
    const mockData = generateAllMockData();
    
    return NextResponse.json({
      success: true,
      message: 'Custom mock data generated successfully',
      data: mockData,
      summary: {
        products: mockData.products.length,
        stores: mockData.stores.length,
        customers: mockData.customers.length,
        inventory: mockData.inventory.length,
        salesTransactions: mockData.salesTransactions.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API POST Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to generate custom mock data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}