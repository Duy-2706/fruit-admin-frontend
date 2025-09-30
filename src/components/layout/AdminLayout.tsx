'use client';
import React, { useState, useEffect } from 'react';
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

  console.log('🔍 AdminLayout render:', { 
    pathname, 
    user: user?.email, 
    isAuthenticated, 
    loading 
  });

  const getActiveSection = () => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.startsWith('/admin/products')) return 'products';
    if (pathname.startsWith('/admin/categories')) return 'categories';
    if (pathname.startsWith('/admin/customers')) return 'customers';
    if (pathname.startsWith('/admin/banners')) return 'banners';
    if (pathname.startsWith('/admin/reports')) return 'reports';
    return 'dashboard';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle authentication và routing
  useEffect(() => {
    if (loading) return; // Đợi auth check xong

    console.log('🔄 AdminLayout useEffect:', {
      pathname,
      isAuthenticated,
      loading
    });

    // Nếu đang ở login page và đã đăng nhập -> redirect to admin
    if (pathname === '/login' && isAuthenticated) {
      console.log('✅ Redirecting from login to admin');
      router.replace('/admin');
      return;
    }

    // Nếu đang ở admin routes và chưa đăng nhập -> redirect to login  
    if (pathname.startsWith('/admin') && !isAuthenticated) {
      console.log('🚫 Redirecting from admin to login');
      router.replace('/login');
      return;
    }

    // Nếu ở root -> redirect dựa vào auth status
    if (pathname === '/') {
      const redirectTo = isAuthenticated ? '/admin' : '/login';
      console.log(`🔍 Redirecting from root to ${redirectTo}`);
      router.replace(redirectTo);
      return;
    }
  }, [pathname, isAuthenticated, loading, router]);

  // Hiển thị loading khi đang check auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Render login page
  if (pathname === '/login') {
    console.log('🔍 Rendering login page');
    return <>{children}</>;
  }

  // Render admin layout
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Sẽ được redirect trong useEffect, hiện loading trong lúc đợi
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
          </div>
        </div>
      );
    }

    console.log('✅ Rendering admin layout with sidebar and header');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <AdminSidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            activeSection={getActiveSection()}
            onSectionChange={() => {}}
          />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader onSidebarToggle={toggleSidebar} />
            <main className="flex-1 overflow-auto bg-gray-50">
              <AdminNavigation activeSection={getActiveSection()} />
              <div className="p-6">{children}</div>
            </main>
          </div>
        </div>
        
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    );
  }

  // Default render cho các routes khác
  console.log('🔍 Rendering default layout');
  return <>{children}</>;
}