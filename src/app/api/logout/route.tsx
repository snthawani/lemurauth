import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(process.env.BASE_URL!);
  response.cookies.delete('auth_token');
  return response;
}