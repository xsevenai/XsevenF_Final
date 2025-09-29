// app/api/tables/[id]/status/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api/v1"

// Helper function to forward headers
function createBackendHeaders(request: NextRequest): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // Forward authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    headers.Authorization = authHeader
  }
  
  return headers
}

// Helper function to handle backend responses
async function handleBackendResponse(response: Response) {
  const contentType = response.headers.get('content-type')
  
  if (!response.ok) {
    let errorData
    try {
      errorData = contentType?.includes('application/json') 
        ? await response.json() 
        : { message: await response.text() }
    } catch {
      errorData = { message: 'Unknown error occurred' }
    }
    
    return NextResponse.json(
      errorData,
      { status: response.status }
    )
  }
  
  // Handle successful responses
  if (contentType?.includes('application/json')) {
    const data = await response.json()
    return NextResponse.json(data)
  } else {
    // For non-JSON responses
    return new NextResponse(null, { status: response.status })
  }
}

// PUT /api/tables/[id]/status - Update table status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body
    
    // Validate required status field
    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }
    
    // Validate status value
    const validStatuses = ['available', 'occupied', 'reserved', 'maintenance']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Make request to backend - note the status endpoint expects just the status value
    const response = await fetch(`${BACKEND_API_URL}/food/tables/${params.id}/status?status=${status}`, {
      method: 'PUT',
      headers: createBackendHeaders(request),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error updating table status:', error)
    return NextResponse.json(
      { message: 'Failed to update table status' },
      { status: 500 }
    )
  }
}

// PATCH /api/tables/[id]/status - Update table status (alternative method)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body
    
    // Validate required status field
    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }
    
    // Validate status value
    const validStatuses = ['available', 'occupied', 'reserved', 'maintenance']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Make request to backend
    const response = await fetch(`${BACKEND_API_URL}/food/tables/${params.id}/status?status=${status}`, {
      method: 'PUT',
      headers: createBackendHeaders(request),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error updating table status:', error)
    return NextResponse.json(
      { message: 'Failed to update table status' },
      { status: 500 }
    )
  }
}