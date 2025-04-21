import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import ClientHome from './ClientHome'

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      isAuthenticated = true;
    } catch (err) {
      console.log('Invalid token or verification failed', err);
    }
  }

  return <ClientHome isAuthenticated={isAuthenticated} />;
}
