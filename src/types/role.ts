export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}