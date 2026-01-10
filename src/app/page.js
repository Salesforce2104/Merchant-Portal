'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import DashboardCharts from '@/components/DashboardCharts';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
  }, []);

  if (user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Welcome back, <span className="font-medium text-gray-900">{user.name || user.email}</span>
              </p>
            </div>
          </div>

          <DashboardCharts />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to <span className="text-primary">Metadologie</span> Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Secure, efficient, and streamlined authentication for your business needs.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <>
            <Link href="/auth/login">
              <Button size="lg" className="w-40 h-12 text-lg">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="w-40 h-12 text-lg">
                Sign Up
              </Button>
            </Link>
          </>
        </div>
      </div>
    </div>
  );
}
