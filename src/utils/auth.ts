import { User } from '@/types/user';

export class AuthUtils {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_KEY = 'user';
  private static readonly AUTH_STATUS_KEY = 'isAuthenticated';

  // ✅ Chỉ lưu thông tin cần thiết, không lưu sensitive data
  static setAuth(token: string, user: User): void {
    if (typeof window === 'undefined') return;

    // Chỉ lưu thông tin cơ bản, không lưu password, sensitive data
    const userToStore = {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      roleId: user.roleId,
      avatar: user.avatar,
      loginTime: new Date().getTime()
    };

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userToStore));
    localStorage.setItem(this.AUTH_STATUS_KEY, 'true');
  }

  // Lấy token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Lấy thông tin user
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuth();
        return null;
      }
    }
    return null;
  }

  // Kiểm tra đăng nhập
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = this.getToken();
    const user = this.getUser();
    const authStatus = localStorage.getItem(this.AUTH_STATUS_KEY);
    
    return !!(token && user && authStatus === 'true');
  }

  // Xóa thông tin đăng nhập
  static clearAuth(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.AUTH_STATUS_KEY);
  }

  // Tạo headers cho API
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Kiểm tra quyền
  static hasRole(requiredRoleId: string): boolean {
    const user = this.getUser();
    return user ? user.roleId === requiredRoleId : false;
  }

  static hasUserType(requiredUserType: number): boolean {
    const user = this.getUser();
    return user ? user.userType === requiredUserType : false;
  }

  static isAdmin(): boolean {
    return this.hasUserType(2); // user_type 2 là admin theo API response
  }
}