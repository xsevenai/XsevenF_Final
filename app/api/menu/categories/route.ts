// app/api/menu/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

const BACKEND_API_URL = config.api.backendUrl

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_API_URL}/food/menu/categories`, {
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
    console.error('Menu categories API error:', error)
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

    const response = await fetch(`${BACKEND_API_URL}/food/menu/categories`, {
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
    console.error('Create category API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}