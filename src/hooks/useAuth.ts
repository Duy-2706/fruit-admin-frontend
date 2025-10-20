// src/hooks/useAuth.ts
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
      const response = await ApiHelper.fetch<any>('api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('🔍 Full API Response:', response);
      console.log('📦 Response.data:', response.data);

      if (response.success) {
        let apiUserData = null;
        let token = null;

        // Try different response structures
        if (response.data?.user && response.data?.token) {
          apiUserData = response.data.user;
          token = response.data.token;
          console.log('📍 Found: response.data.user & response.data.token');
        } else if (response.data?.id && response.data?.email) {
          apiUserData = response.data;
          token = response.data.token;
          console.log('📍 Found: response.data is user');
        }

        console.log('👤 API User Data:', apiUserData);
        console.log('🔑 Token:', token ? '✅ exists' : '❌ missing');
        console.log('🏢 branch_id from API:', apiUserData?.branch_id);

        if (!apiUserData || !token) {
          console.error('❌ Missing data:', { apiUserData, token });
          return {
            success: false,
            message: 'Dữ liệu đăng nhập không hợp lệ',
          };
        }

        // Map API data to User interface
        const userData: User = {
          id: String(apiUserData.id),
          name: apiUserData.name || 'Khách',
          email: apiUserData.email,
          userType: Number(apiUserData.user_type),
          roleId: String(apiUserData.role_id),
          avatar: apiUserData.avatar,
          lastLogin: apiUserData.last_login,
          created_at: apiUserData.created_at,
          updated_at: apiUserData.updated_at,
          branchId: apiUserData.branch_id ? Number(apiUserData.branch_id) : undefined,
        };

        console.log('✅ Mapped User:', JSON.stringify(userData, null, 2));
        console.log('✅ branchId in User object:', userData.branchId);

        // Save to localStorage via AuthUtils
        AuthUtils.setAuth(token, userData);

        // Verify what was saved
        const savedUserStr = localStorage.getItem('user');
        console.log('💾 Saved to localStorage (raw):', savedUserStr);
        
        if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          console.log('💾 Parsed localStorage user:', savedUser);
          console.log('💾 branchId in localStorage:', savedUser.branchId);
        }

        // Load permissions
        const permResponse = await PermissionService.getPermissionsByRole(userData.roleId);
        if (permResponse.success && permResponse.data) {
          AuthUtils.setPermissions(permResponse.data);
        }

        setUser(userData);
        setIsAuthenticated(true);

        await initAuth();

        return { 
          success: true, 
          message: response.message || 'Login successful' 
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
          errors: response.errors || { general: response.message },
        };
      }
    } catch (error: any) {
      console.error('💥 Login error:', error);
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