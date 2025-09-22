// app/api/analytics/orders/[id]/[orderId]/status/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

// PUT /api/analytics/orders/[id]/[orderId]/status - Update Order Status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string, orderId: string } }
) {
  try {
    const businessId = params.id
    const orderId = params.orderId
    const statusData = await request.json()
    
    // Validate required fields
    if (!statusData.status) {
      return NextResponse.json(
        { error: 'Status field is required' },
        { status: 400 }
      )
    }
    
    // Get auth token from request headers
    const authToken = request.headers.get('authorization')
    
    // Make request to backend
    const response = await fetch(
      `${BACKEND_API_URL}/api/v1/analytics/orders/${businessId}/${orderId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': authToken }),
        },
        body: JSON.stringify(statusData),
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to update order status' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Update order status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}