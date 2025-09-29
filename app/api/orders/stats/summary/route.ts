// app/api/orders/stats/summary/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000/api/v1'

// Helper function to get auth headers
function getAuthHeaders(request: NextRequest) {
  const token = request.headers.get('authorization')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token })
  }
}

// GET /api/orders/stats/summary - Get order statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '30'

    const url = `${BACKEND_URL}/food/orders/stats/summary?days=${days}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(request)
    })

    if (!response.ok) {
      // If backend returns error (like no business or no orders), return default stats
      console.log(`Backend stats error: ${response.status}`)
      
      const defaultStats = {
        period_days: parseInt(days),
        total_orders: 0,
        completed_orders: 0,
        completion_rate: 0,
        total_revenue: 0,
        average_order_value: 0,
        status_breakdown: {},
        daily_order_counts: {}
      }
      
      return NextResponse.json(defaultStats)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Order Stats API Error:', error)
    
    // Return default stats on any error
    const defaultStats = {
      period_days: 30,
      total_orders: 0,
      completed_orders: 0,
      completion_rate: 0,
      total_revenue: 0,
      average_order_value: 0,
      status_breakdown: {},
      daily_order_counts: {}
    }
    
    return NextResponse.json(defaultStats)
  }
}