// app/api/orders/active/route.ts

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

// GET /api/orders/active - Get all active orders
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/food/orders/active`, {
      method: 'GET',
      headers: getAuthHeaders(request)
    })

    if (!response.ok) {
      console.log(`Backend active orders error: ${response.status}`)
      return NextResponse.json([])
    }

    const activeOrders = await response.json()
    return NextResponse.json(activeOrders)
  } catch (error) {
    console.error('Active Orders API Error:', error)
    return NextResponse.json([])
  }
}