'use client';
import { useState, useEffect, useCallback } from 'react';
import { AuthUtils } from '@/utils/auth';
import { ApiHelper } from '@/utils/api';
import { User } from '@/types/user';
import { LoginRequest } from '@/types/auth';
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

      console.log('🔍 Init Auth - Current User:', JSON.stringify(currentUser, null, 2));
      console.log('🔍 Init Auth - Auth Status:', authStatus);

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

      console.log('🔍 Full API Response:', JSON.stringify(response, null, 2));

      if (response.success) {
        let apiUserData = null;
        let token = null;

        // Case 1: response.data = { user: {...}, token: "..." }
        if (response.data?.user && response.data?.token) {
          apiUserData = response.data.user;
          token = response.data.token;
          console.log('📍 Case 1: Found response.data.user & response.data.token');
        } 
        // Case 2: response.data = { id, email, token, ... } (user data trực tiếp)
        else if (response.data?.id && response.data?.email) {
          apiUserData = response.data;
          token = response.data.token || null;
          console.log('📍 Case 2: response.data is user object');
        }

        console.log('👤 API User Data:', JSON.stringify(apiUserData, null, 2));
        console.log('🔑 Token:', token ? '✅ exists' : '❌ missing');

        if (!apiUserData || !token) {
          console.error('❌ Missing data:', { apiUserData, token });
          return {
            success: false,
            message: 'Dữ liệu đăng nhập không hợp lệ - thiếu user hoặc token',
          };
        }

        // ✅ DEBUG: Log raw branch_id từ API
        console.log('🏢 Raw branch_id from API:');
        console.log('  - Value:', apiUserData.branch_id);
        console.log('  - Type:', typeof apiUserData.branch_id);
        console.log('  - Is null?', apiUserData.branch_id === null);
        console.log('  - Is undefined?', apiUserData.branch_id === undefined);
        console.log('  - Is 0?', apiUserData.branch_id === 0);

        // ✅ FIX: Xử lý branchId đúng cách
        let branchId: number;
        if (apiUserData.branch_id === null || apiUserData.branch_id === undefined || isNaN(Number(apiUserData.branch_id))) {
          branchId = 0;
          console.log('🏢 branch_id is null/undefined/NaN → set to 0');
        } else {
          branchId = Number(apiUserData.branch_id);
          console.log('🏢 branch_id converted to:', branchId);
        }

        const userData: User = {
          id: String(apiUserData.id),
          name: apiUserData.name || 'Khách',
          email: apiUserData.email,
          userType: Number(apiUserData.user_type || 0),
          roleId: String(apiUserData.role_id || ''),
          avatar: apiUserData.avatar || null,
          lastLogin: apiUserData.last_login || null,
          created_at: apiUserData.created_at || null,
          updated_at: apiUserData.updated_at || null,
          branchId: branchId, // ✅ Sử dụng giá trị đã xử lý
        };

        console.log('✅ Final User object:', JSON.stringify(userData, null, 2));
        console.log('✅ Final branchId:', userData.branchId, 'Type:', typeof userData.branchId);

        // Save to localStorage
        AuthUtils.setAuth(token, userData);

        // ✅ Verify lại sau khi lưu
        const savedUser = AuthUtils.getUser();
        console.log('💾 Verification - User from localStorage:', JSON.stringify(savedUser, null, 2));
        console.log('💾 Verification - branchId from localStorage:', savedUser?.branchId, typeof savedUser?.branchId);

        // Fetch permissions
        if (userData.roleId) {
          const permResponse = await PermissionService.getPermissionsByRole(userData.roleId);
          if (permResponse.success && permResponse.data) {
            AuthUtils.setPermissions(permResponse.data);
          }
        }

        setUser(userData);
        setIsAuthenticated(true);

        await initAuth();

        return { 
          success: true, 
          message: response.message || 'Đăng nhập thành công' 
        };
      } else {
        return {
          success: false,
          message: response.message || 'Đăng nhập thất bại',
          errors: response.errors || { general: response.message },
        };
      }
    } catch (error: any) {
      console.error('💥 Login error:', error);
      return {
        success: false,
        message: error.message || 'Đăng nhập thất bại',
        errors: { general: error.message || 'Lỗi không xác định' },
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