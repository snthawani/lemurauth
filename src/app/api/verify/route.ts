import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const tokenParam = req.nextUrl.searchParams.get('token');

  if (!id) {
    return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
  }

  if (!tokenParam) {
    return NextResponse.json({ error: 'Token not provided' }, { status: 400 });
  }

  const existingUser = await User.findOne({ _id: id });

  if (!existingUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }


  if (tokenParam !== existingUser.token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const jwtToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });

  existingUser.token = '';
  await existingUser.save();

  const response = NextResponse.json({ message: 'Login successful' });

  response.cookies.set('auth_token', jwtToken, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: '/',
  });

  return response;
}
