// app/api/tables/layout/route.ts

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

// PUT /api/tables/layout - Update table layout
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body structure
    if (!body.tables || !Array.isArray(body.tables)) {
      return NextResponse.json(
        { message: 'Invalid request body. Expected { tables: Array }' },
        { status: 400 }
      )
    }
    
    // Validate each table entry
    for (const table of body.tables) {
      if (!table.id) {
        return NextResponse.json(
          { message: 'Each table must have an id field' },
          { status: 400 }
        )
      }
    }
    
    const response = await fetch(`${BACKEND_API_URL}/food/tables/layout`, {
      method: 'PUT',
      headers: createBackendHeaders(request),
      body: JSON.stringify(body),
    })
    
    return handleBackendResponse(response)
  } catch (error) {
    console.error('Error updating table layout:', error)
    return NextResponse.json(
      { message: 'Failed to update table layout' },
      { status: 500 }
    )
  }
}