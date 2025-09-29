// app/api/tables/[id]/route.ts

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
    // For non-JSON responses (like DELETE)
    return new NextResponse(null, { status: response.status })
  }
}

// GET /api/tables/[id] - Get single table
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/food/tables/${params.id}/`, {
      method: 'GET',
      headers: createBackendHeaders(request),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error fetching table:', error)
    return NextResponse.json(
      { message: 'Failed to fetch table' },
      { status: 500 }
    )
  }
}

// PUT /api/tables/[id] - Update table (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_API_URL}/food/tables/${params.id}/`, {
      method: 'PUT',
      headers: createBackendHeaders(request),
      body: JSON.stringify(body),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error updating table:', error)
    return NextResponse.json(
      { message: 'Failed to update table' },
      { status: 500 }
    )
  }
}

// PATCH /api/tables/[id] - Update table (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_API_URL}/food/tables/${params.id}/`, {
      method: 'PATCH',
      headers: createBackendHeaders(request),
      body: JSON.stringify(body),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error updating table:', error)
    return NextResponse.json(
      { message: 'Failed to update table' },
      { status: 500 }
    )
  }
}

// DELETE /api/tables/[id] - Delete table
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/food/tables/${params.id}/`, {
      method: 'DELETE',
      headers: createBackendHeaders(request),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error deleting table:', error)
    return NextResponse.json(
      { message: 'Failed to delete table' },
      { status: 500 }
    )
  }
}