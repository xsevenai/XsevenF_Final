// app/api/analytics/combined/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

// GET /api/analytics/combined/[id] - Get Combined Analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = params.id
    
    // Extract query parameters
    const period = searchParams.get('period') || '7d'
    
    // Build query string for backend
    const queryParams = new URLSearchParams({
      period
    })
    
    // Get auth token from request headers
    const authToken = request.headers.get('authorization')
    
    // Make request to backend
    const response = await fetch(
      `${BACKEND_API_URL}/analytics/combined/${businessId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': authToken }),
        },
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch combined analytics' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Combined analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}