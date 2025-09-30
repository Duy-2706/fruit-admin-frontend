'use client';
import { useState, useEffect, useCallback } from 'react';
import { AuthUtils } from '@/utils/auth';
import { ApiHelper } from '@/utils/api';
import { User, UserData } from '@/types/user';
import { LoginRequest, LoginResponse } from '@/types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = AuthUtils.getUser();
      const authStatus = AuthUtils.isAuthenticated();

      console.log('🔍 initAuth check:', { currentUser, authStatus });

      if (currentUser && authStatus) {
        console.log('Found existing auth, using cached user:', currentUser);
        setUser(currentUser);
        setIsAuthenticated(true);
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
    console.log('Starting login process...');

    try {
      const response = await ApiHelper.fetch<LoginResponse>('api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('Login API response:', response);

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

        // Set localStorage
        AuthUtils.setAuth(response.data.token, userData);

        // Verify localStorage
        console.log('🔍 After setAuth - localStorage check:', {
          token: !!AuthUtils.getToken(),
          user: AuthUtils.getUser(),
          isAuth: AuthUtils.isAuthenticated(),
        });

        // Set states
        setUser(userData);
        setIsAuthenticated(true);

        // Gọi lại initAuth để đảm bảo trạng thái đồng bộ
        await initAuth();

        // Verify states
        console.log('🔍 After setState:', {
          userData,
          isAuthenticated: true,
        });

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
    console.log('Logging out...');

    ApiHelper.authFetch('api/v1/auth/logout', { method: 'POST' })
      .catch((error) => console.warn('Logout API failed:', error));

    AuthUtils.clearAuth();
    setUser(null);
    setIsAuthenticated(false);

    // Gọi lại initAuth để đảm bảo trạng thái đồng bộ
    initAuth();

    console.log('🔍 After logout - localStorage check:', {
      token: !!AuthUtils.getToken(),
      user: !!AuthUtils.getUser(),
      isAuth: AuthUtils.isAuthenticated(),
    });
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

  console.log('🔍 Final auth state:', { user, isAuthenticated, loading });

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasUserType,
    isAdmin,
  };
};