import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#00050d' }} />}>
      <LoginForm />
    </Suspense>
  );
}
