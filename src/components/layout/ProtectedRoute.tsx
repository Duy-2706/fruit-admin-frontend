'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserPermissions } from '@/hooks/useUserPermission';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallbackPath = '/admin',
}) => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { permissions: userPermissions, loading: permissionsLoading, hasAnyPermission, hasAllPermissions } = useUserPermissions();
  useEffect(() => {
    if (authLoading || permissionsLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredPermissions.length === 0) {
      return;
    }

    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      router.push(fallbackPath);
    }
  }, [
    isAuthenticated,
    authLoading,
    permissionsLoading,
    requiredPermissions,
    requireAll,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
    router,
    fallbackPath,
  ]);

  if (authLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
};

export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export const ProtectedRoutePresets = {
  AdminOnly: ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute requiredPermissions={['manage-roles', 'manage-permissions']} requireAll={false}>
      {children}
    </ProtectedRoute>
  ),

  ProductManagement: ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute requiredPermissions={['manage-products']}>
      {children}
    </ProtectedRoute>
  ),

  ProductView: ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute requiredPermissions={['manage-products', 'view-products']} requireAll={false}>
      {children}
    </ProtectedRoute>
  ),

  OrderManagement: ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute requiredPermissions={['manage-orders']}>
      {children}
    </ProtectedRoute>
  ),

  OrderView: ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute requiredPermissions={['manage-orders', 'view-orders']} requireAll={false}>
      {children}
    </ProtectedRoute>
  ),

  InventoryManagement: ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute requiredPermissions={['manage-inventory']}>
      {children}
    </ProtectedRoute>
  ),
};