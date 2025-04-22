import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('🧪 Received request with body:', body)

  return NextResponse.json({ message: '✅ Reached API route' })
}
