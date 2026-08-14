export const dynamic = 'force-dynamic';
import { Login } from '@gitroom/frontend/components/auth/login';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'DentalCore Social · Iniciar sesión',
  description: '',
};
export default async function Auth() {
  return <Login />;
}
