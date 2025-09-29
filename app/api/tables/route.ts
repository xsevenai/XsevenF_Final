// app/api/tables/route.ts

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

// GET /api/tables - Get all tables
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/food/tables/`, {
      method: 'GET',
      headers: createBackendHeaders(request),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json(
      { message: 'Failed to fetch tables' },
      { status: 500 }
    )
  }
}

// POST /api/tables - Create new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_API_URL}/food/tables/`, {
      method: 'POST',
      headers: createBackendHeaders(request),
      body: JSON.stringify(body),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error creating table:', error)
    return NextResponse.json(
      { message: 'Failed to create table' },
      { status: 500 }
    )
  }
}