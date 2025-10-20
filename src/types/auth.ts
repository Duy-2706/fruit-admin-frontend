import { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    user_type: number;
    role_id: string;
    branch_id?: number; // ✅ THÊM FIELD NÀY
    avatar?: string;
    last_login?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}