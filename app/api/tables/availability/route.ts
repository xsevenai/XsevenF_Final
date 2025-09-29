// app/api/tables/availability/route.ts

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
    return new NextResponse(null, { status: response.status })
  }
}

// GET /api/tables/availability - Check table availability
export async function GET(request: NextRequest) {
  try {
    // Get search parameters from the request URL
    const { searchParams } = new URL(request.url)
    
    // Build query string for backend
    const queryParams = new URLSearchParams()
    
    // Add optional filters
    const section = searchParams.get('section')
    if (section) {
      queryParams.append('section', section)
    }
    
    const capacity = searchParams.get('capacity')
    if (capacity) {
      queryParams.append('capacity', capacity)
    }
    
    // Construct backend URL with query parameters
    const backendUrl = `${BACKEND_API_URL}/food/tables/availability${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: createBackendHeaders(request),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error checking table availability:', error)
    return NextResponse.json(
      { message: 'Failed to check table availability' },
      { status: 500 }
    )
  }
}