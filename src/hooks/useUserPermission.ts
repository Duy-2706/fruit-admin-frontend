'use client';
import { useState, useEffect } from 'react';
import { Permission } from '@/types/permission';
import { AuthUtils } from '@/utils/auth';
import { ApiHelper } from '@/utils/api';

/**
 * Hook để lấy permissions của user hiện tại
 * Dùng để render sidebar/menu theo quyền
 */
export function useUserPermissions() {
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPermissions = async () => {
    setLoading(true);
    try {
      if (!AuthUtils.isAuthenticated()) {
        console.warn('User not authenticated');
        setUserPermissions([]);
        return;
      }

      const user = AuthUtils.getUser();
      if (!user?.roleId) {
        console.warn('User roleId not found');
        setUserPermissions([]);
        return;
      }

      console.log('🔄 Fetching permissions for user roleId:', user.roleId);
      const response = await ApiHelper.get<Permission[]>(
        `api/v1/roles/${user.roleId}/permissions`
      );

      if (response.success && response.data) {
        console.log('✅ User permissions loaded:', response.data);
        setUserPermissions(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error('Failed to load user permissions:', response.message);
        setUserPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      setUserPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function: Kiểm tra user có quyền cụ thể không
  const hasPermission = (slug: string): boolean => {
    return userPermissions.some(p => p.slug === slug);
  };

  // Helper function: Kiểm tra user có bất kỳ quyền nào trong danh sách không
  const hasAnyPermission = (slugs: string[]): boolean => {
    return slugs.some(slug => hasPermission(slug));
  };

  // Helper function: Kiểm tra user có tất cả quyền trong danh sách không
  const hasAllPermissions = (slugs: string[]): boolean => {
    return slugs.every(slug => hasPermission(slug));
  };

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  return {
    userPermissions,
    loading,
    fetchUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}