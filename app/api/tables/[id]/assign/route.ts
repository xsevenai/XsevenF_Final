// app/api/tables/[id]/assign/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:8000/api/v1"

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
    return new NextResponse(null, { status: response.status })
  }
}

// POST /api/tables/[id]/assign - Assign customer to table
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.party_size || body.party_size < 1) {
      return NextResponse.json(
        { message: 'Party size is required and must be at least 1' },
        { status: 400 }
      )
    }
    
    if (!body.customer_name && !body.customer_phone) {
      return NextResponse.json(
        { message: 'Either customer name or phone number must be provided' },
        { status: 400 }
      )
    }
    
    const response = await fetch(`${BACKEND_API_URL}/food/tables/${params.id}/assign`, {
      method: 'POST',
      headers: createBackendHeaders(request),
      body: JSON.stringify(body),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error assigning customer to table:', error)
    return NextResponse.json(
      { message: 'Failed to assign customer to table' },
      { status: 500 }
    )
  }
}