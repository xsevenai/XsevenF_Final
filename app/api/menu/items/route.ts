// app/api/menu/items/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

const BACKEND_API_URL = config.api.backendUrl

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category_id = searchParams.get('category_id')
    const is_available = searchParams.get('is_available')
    const search = searchParams.get('search')

    // Build query string
    const queryParams = new URLSearchParams()
    if (category_id) queryParams.append('category_id', category_id)
    if (is_available) queryParams.append('is_available', is_available)
    if (search) queryParams.append('search', search)

    const queryString = queryParams.toString()
    const url = `${BACKEND_API_URL}/food/menu/items${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: `Backend error: ${error}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Menu items API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${BACKEND_API_URL}/food/menu/items`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: `Backend error: ${error}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('Create menu item API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}