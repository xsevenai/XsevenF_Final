// app/api/check-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { data } = await supabase
      .from('businesses')
      .select('email')
      .eq('email', email)
      .single()

    return NextResponse.json({ exists: !!data })
  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
