// app/api/tables/[id]/qr/route.ts

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

// GET /api/tables/[id]/qr - Get table QR code
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get search parameters from the request URL
    const { searchParams } = new URL(request.url)
    
    // Build query string for backend
    const queryParams = new URLSearchParams()
    
    // Add optional QR code parameters
    const size = searchParams.get('size')
    if (size) {
      queryParams.append('size', size)
    }
    
    const color = searchParams.get('color')
    if (color) {
      queryParams.append('color', color)
    }
    
    const background_color = searchParams.get('background_color')
    if (background_color) {
      queryParams.append('background_color', background_color)
    }
    
    // Construct backend URL with query parameters
    const backendUrl = `${BACKEND_API_URL}/food/tables/${params.id}/qr${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: createBackendHeaders(request),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { message: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}