// app/api/analytics/orders/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

// GET /api/analytics/orders/[id] - Get Orders Analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = params.id
    
    // Extract query parameters
    const period = searchParams.get('period') || '7d'
    const statusFilter = searchParams.get('status_filter')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    
    // Build query string for backend
    const queryParams = new URLSearchParams({
      period
    })
    
    if (statusFilter) queryParams.append('status_filter', statusFilter)
    if (startDate) queryParams.append('start_date', startDate)
    if (endDate) queryParams.append('end_date', endDate)
    
    // Get auth token from request headers
    const authToken = request.headers.get('authorization')
    
    // Make request to backend
    const response = await fetch(
      `${BACKEND_API_URL}/analytics/orders/${businessId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': authToken }),
        },
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch orders analytics' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Analytics orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/orders/[id] - Create Order Record
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id
    const orderData = await request.json()
    
    // Get auth token from request headers
    const authToken = request.headers.get('authorization')
    
    // Make request to backend
    const response = await fetch(
      `${BACKEND_API_URL}/analytics/orders/${businessId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': authToken }),
        },
        body: JSON.stringify(orderData),
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create order record' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Create order record API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}