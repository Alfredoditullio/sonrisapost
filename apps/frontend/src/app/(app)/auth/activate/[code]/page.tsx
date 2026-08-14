export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AfterActivate } from '@gitroom/frontend/components/auth/after.activate';
export const metadata: Metadata = {
  title: 'DentalCore Social · Activar cuenta',
  description: '',
};
export default async function Auth() {
  return <AfterActivate />;
}
