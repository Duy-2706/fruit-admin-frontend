export interface User {
  id: string;
  name: string;
  email: string;
  userType: number;
  roleId: string;
  lastLogin?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  branchId?: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  user_type: number;
  role_id: string;
  last_login?: string; 
  avatar?: string; 
  created_at?: string; 
  updated_at?: string; 
  branch_id?: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  user_type: number;
  role_id: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  user_type?: number;
  role_id?: string;
}