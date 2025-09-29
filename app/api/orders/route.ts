// app/api/orders/route.ts

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

// GET /api/orders - Get all orders with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const order_type = searchParams.get('order_type')
    const table_id = searchParams.get('table_id')
    const limit = searchParams.get('limit')

    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (order_type) params.append('order_type', order_type)
    if (table_id) params.append('table_id', table_id)
    if (limit) params.append('limit', limit)

    const url = `${BACKEND_URL}/food/orders/${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(request)
    })

    if (!response.ok) {
      // If backend returns error (like no business or no orders), return empty array
      console.log(`Backend orders error: ${response.status}`)
      return NextResponse.json([])
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Orders API Error:', error)
    // Return empty array on error so the component doesn't crash
    return NextResponse.json([])
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/food/orders/`, {
      method: 'POST',
      headers: getAuthHeaders(request),
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create order' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Orders API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}