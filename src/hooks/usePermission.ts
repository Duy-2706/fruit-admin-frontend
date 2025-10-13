'use client';
import { useState, useEffect, useCallback } from 'react';
import { Permission } from '@/types/permission';
import { PermissionService } from '@/services/permissionService';
import { AuthUtils } from '@/utils/auth';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async (roleId: string) => {
    setLoading(true);
    setError(null);

    try {
      const cachedPermissions = AuthUtils.getPermissions();
      if (cachedPermissions && cachedPermissions.length > 0) {
        setPermissions(cachedPermissions);
        setLoading(false);
        return;
      }

      const response = await PermissionService.getPermissionsByRole(roleId);

      if (response.success && response.data) {
        setPermissions(response.data);
        AuthUtils.setPermissions(response.data);
      } else {
        setError(response.message || 'Failed to load permissions');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = AuthUtils.getUser();
    if (user?.roleId) {
      fetchPermissions(user.roleId);
    } else {
      setLoading(false);
    }
  }, [fetchPermissions]);

  const hasPermission = useCallback((slug: string): boolean => {
    return PermissionService.hasPermission(permissions, slug);
  }, [permissions]);

  const hasAnyPermission = useCallback((slugs: string[]): boolean => {
    return PermissionService.hasAnyPermission(permissions, slugs);
  }, [permissions]);

  const hasAllPermissions = useCallback((slugs: string[]): boolean => {
    return PermissionService.hasAllPermissions(permissions, slugs);
  }, [permissions]);

  const refreshPermissions = useCallback(async () => {
    const user = AuthUtils.getUser();
    if (user?.roleId) {
      await fetchPermissions(user.roleId);
    }
  }, [fetchPermissions]);

  const clearPermissions = useCallback(() => {
    setPermissions([]);
    AuthUtils.clearPermissions();
  }, []);

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions,
    clearPermissions,
  };
};