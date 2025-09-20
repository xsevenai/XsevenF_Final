// app/api/menu/items/[item_id]/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

const BACKEND_API_URL = config.api.backendUrl

export async function PUT(
  request: NextRequest,
  { params }: { params: { item_id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const body = await request.json()
    const { item_id } = params

    const response = await fetch(`${BACKEND_API_URL}/food/menu/items/${item_id}/availability`, {
      method: 'PUT',
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
    return NextResponse.json(data)

  } catch (error) {
    console.error('Update item availability API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}