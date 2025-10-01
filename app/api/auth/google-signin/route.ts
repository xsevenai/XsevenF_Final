import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, googleId, image } = await request.json()

    // Check if user exists in your database
    const checkUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/google/check-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email, 
        google_id: googleId 
      })
    })

    if (checkUserResponse.ok) {
      // User exists, return their data
      const userData = await checkUserResponse.json()
      return NextResponse.json({
        exists: true,
        user: userData,
        businessId: userData.business_id,
        userId: userData.user_id,
        role: userData.role || 'owner'
      })
    }

    // User doesn't exist, they need to complete signup
    return NextResponse.json({
      exists: false,
      needsOnboarding: true,
      email,
      name,
      googleId,
      image
    })

  } catch (error) {
    console.error('Google sign-in error:', error)
    return NextResponse.json(
      { error: 'Failed to process Google sign-in' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Google sign-in endpoint' })
}