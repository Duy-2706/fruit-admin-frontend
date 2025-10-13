'use client';
import { useState, useEffect, useCallback } from 'react';
import { AuthUtils } from '@/utils/auth';
import { ApiHelper } from '@/utils/api';
import { User, UserData } from '@/types/user';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { PermissionService } from '@/services/permissionService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = AuthUtils.getUser();
      const authStatus = AuthUtils.isAuthenticated();

      if (currentUser && authStatus) {
        setUser(currentUser);
        setIsAuthenticated(true);

        const cachedPermissions = AuthUtils.getPermissions();
        if (!cachedPermissions && currentUser.roleId) {
          const permResponse = await PermissionService.getPermissionsByRole(currentUser.roleId);
          if (permResponse.success && permResponse.data) {
            AuthUtils.setPermissions(permResponse.data);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await ApiHelper.fetch<LoginResponse>('api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data) {
        const apiUserData: UserData = response.data.user;

        const userData: User = {
          id: apiUserData.id,
          name: apiUserData.name || 'Khách',
          email: apiUserData.email,
          userType: apiUserData.user_type,
          roleId: apiUserData.role_id,
          avatar: apiUserData.avatar || undefined,
        };

        AuthUtils.setAuth(response.data.token, userData);

        const permResponse = await PermissionService.getPermissionsByRole(userData.roleId);
        if (permResponse.success && permResponse.data) {
          AuthUtils.setPermissions(permResponse.data);
        }

        setUser(userData);
        setIsAuthenticated(true);

        await initAuth();

        return { success: true, message: response.data.message || 'Login successful' };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
          errors: response.errors || { general: response.message },
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed',
        errors: { general: error.message || 'Unknown error' },
      };
    }
  }, [initAuth]);

  const logout = useCallback(() => {
    ApiHelper.authFetch('api/v1/auth/logout', { method: 'POST' })
      .catch((error) => console.warn('Logout API failed:', error));

    AuthUtils.clearAuth();
    setUser(null);
    setIsAuthenticated(false);

    initAuth();
  }, [initAuth]);

  const hasRole = useCallback((roleId: string) => {
    return AuthUtils.hasRole(roleId);
  }, []);

  const hasUserType = useCallback((userType: number) => {
    return AuthUtils.hasUserType(userType);
  }, []);

  const isAdmin = useCallback(() => {
    return AuthUtils.isAdmin();
  }, []);

  const hasPermission = useCallback((slug: string) => {
    return AuthUtils.hasPermission(slug);
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasUserType,
    isAdmin,
    hasPermission,
  };
};