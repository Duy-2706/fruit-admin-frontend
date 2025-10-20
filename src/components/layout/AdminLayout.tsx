'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasUnauthorizedRole, setHasUnauthorizedRole] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useRef(false);

  console.log('🔍 AdminLayout render:', { 
    pathname, 
    user: user?.email, 
    userType: user?.userType,
    roleId: user?.roleId,
    isAuthenticated, 
    loading, 
    hasMounted: hasMounted.current,
    hasUnauthorizedRole,
    isRedirecting
  });

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
    // Đánh dấu đã mount
    if (!hasMounted.current) {
      hasMounted.current = true;
    }
    
    // Reset tất cả state khi component mount hoặc pathname thay đổi
    setIsRedirecting(false);
    
    if (loading) return;

    console.log('🔄 AdminLayout useEffect:', { 
      pathname, 
      isAuthenticated, 
      loading,
      userType: user?.userType,
      roleId: user?.roleId,
      hasUnauthorizedRole,
      isRedirecting
    });

    // Reset state khi không ở admin hoặc chưa đăng nhập
    if (!pathname.startsWith('/admin') || !isAuthenticated || !user) {
      setHasUnauthorizedRole(false);
      setIsRedirecting(false);
      return;
    }

    // Kiểm tra nếu đang ở trang admin
    if (pathname.startsWith('/admin')) {
      // Kiểm tra chưa đăng nhập
      if (!isAuthenticated) {
        console.log('🚫 Redirecting from admin to login');
        setIsRedirecting(false);
        setHasUnauthorizedRole(false);
        router.replace('/login');
        return;
      }

      // ===== KIỂM TRA ROLE - Chặn userType = 2 hoặc roleId = '2' =====
      if (user && (user.userType === 2 || user.roleId === '2')) {
        console.log('🚫 Unauthorized role detected:', { 
          userType: user.userType, 
          roleId: user.roleId 
        });
        setHasUnauthorizedRole(true);
        setIsRedirecting(false); // Đảm bảo reset
        return;
      } else {
        // Reset state nếu user hợp lệ
        console.log('✅ Valid role, resetting states');
        setHasUnauthorizedRole(false);
        setIsRedirecting(false);
      }
    }
  }, [pathname, isAuthenticated, loading, router, user]);

  // ===== LOADING STATE =====
  if (loading) {
    console.log('⏳ AdminLayout rendering loading state...');
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

  if (hasUnauthorizedRole) {
    console.log('🚫 Showing unauthorized access screen');
    
    if (isRedirecting) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
              <svg 
              className="w-20 h-20 text-red-500 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Không có quyền truy cập
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn không có quyền truy cập vào trang quản trị. Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsRedirecting(true);
                  router.replace('/');
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
          activeSection={getActiveSection()} 
          onSectionChange={() => {}} 
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader onSidebarToggle={toggleSidebar} />
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
}