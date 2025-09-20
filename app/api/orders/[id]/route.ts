// app/api/orders/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/api/v1'

// Helper function to get auth headers
function getAuthHeaders(request: NextRequest) {
  const token = request.headers.get('authorization')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token })
  }
}

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id

    const response = await fetch(`${BACKEND_URL}/food/orders/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders(request)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch order' },
        { status: response.status }
      )
    }

    const order = await response.json()
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const updateData = await request.json()

    const response = await fetch(`${BACKEND_URL}/food/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(request),
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to update order' },
        { status: response.status }
      )
    }

    const updatedOrder = await response.json()
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - Cancel/Delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const { searchParams } = new URL(request.url)
    const reason = searchParams.get('reason')

    console.log('DELETE request details:', {
      orderId,
      reason,
      fullUrl: request.url
    })

    const backendUrl = `${BACKEND_URL}/food/orders/${orderId}`
    
    // Only update status and reason, don't include cancelled_by
    const requestBody = {
      status: 'cancelled',
      ...(reason && { cancellation_reason: reason })
    }
    
    console.log('Backend URL:', backendUrl)
    console.log('Request body:', requestBody)

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: getAuthHeaders(request),
      body: JSON.stringify(requestBody)
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)
      
      let errorData = {}
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { detail: errorText || 'Unknown error' }
      }

      return NextResponse.json(
        { error: errorData.detail || errorData.message || 'Failed to cancel order' },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('Backend success response:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}