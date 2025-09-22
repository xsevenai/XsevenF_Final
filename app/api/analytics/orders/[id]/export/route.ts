// app/api/analytics/orders/[id]/export/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = params.id
    
    // Extract query parameters
    const period = searchParams.get('period') || '30d'
    const format = searchParams.get('format') || 'json'
    
    // Build query string for backend
    const queryParams = new URLSearchParams({
      period,
      format
    })
    
    // Get auth token from request headers
    const authToken = request.headers.get('authorization')
    
    // Make request to backend
    const response = await fetch(
      `${BACKEND_API_URL}/analytics/orders/${businessId}/export?${queryParams}`,
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
        { error: errorData.detail || 'Failed to export orders data' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    // If format is CSV or Excel, convert the data
    if (format === 'csv') {
      const csvContent = convertToCSV(data.data)
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="orders-export-${period}.csv"`
        }
      })
    } else if (format === 'xlsx') {
      // For Excel format, you might want to use a library like xlsx
      // For now, return JSON with proper headers
      return new NextResponse(JSON.stringify(data.data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="orders-export-${period}.json"`
        }
      })
    }
    
    // Default JSON format
    return new NextResponse(JSON.stringify(data.data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="orders-export-${period}.json"`
      }
    })
    
  } catch (error) {
    console.error('Export orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to convert JSON to CSV
function convertToCSV(orders: any[]): string {
  if (!orders || orders.length === 0) {
    return 'No data available'
  }
  
  // Get headers from the first order object
  const headers = Object.keys(orders[0])
  
  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...orders.map(order => 
      headers.map(header => {
        const value = order[header]
        // Handle arrays and objects
        if (Array.isArray(value)) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        } else if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        } else if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ]
  
  return csvRows.join('\n')
}