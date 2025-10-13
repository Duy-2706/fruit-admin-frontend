'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import AdminNavigation from '@/components/layout/AdminNavigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useRef(false);

  console.log('🔍 AdminLayout render:', { pathname, user: user?.email, isAuthenticated, loading, hasMounted: hasMounted.current });

  const getActiveSection = () => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.startsWith('/admin/products')) return 'products';
    if (pathname.startsWith('/admin/categories')) return 'categories';
    if (pathname.startsWith('/admin/customers')) return 'customers';
    if (pathname.startsWith('/admin/banners')) return 'banners';
    if (pathname.startsWith('/admin/reports')) return 'reports';
    if (pathname.startsWith('/admin/permissions')) return 'permissions';
    return 'dashboard';
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      console.log('🔄 AdminLayout first mount, skipping redirect...');
      return;
    }
    if (loading) return;

    console.log('🔄 AdminLayout useEffect:', { pathname, isAuthenticated, loading });
    if (pathname.startsWith('/admin') && !isAuthenticated) {
      console.log('🚫 Redirecting from admin to login');
      router.replace('/login');
    }
  }, [pathname, isAuthenticated, loading, router]);

  if (loading && !hasMounted.current) {
    console.log('⏳ AdminLayout rendering initial loading state...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!pathname.startsWith('/admin')) return <>{children}</>;

  if (!isAuthenticated) {
    console.log('🚫 AdminLayout not authenticated, waiting for redirect...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  console.log('✅ AdminLayout rendering admin layout with sidebar and header');
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} activeSection={getActiveSection()} onSectionChange={() => {}} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader onSidebarToggle={toggleSidebar} />
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}