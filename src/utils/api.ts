import { ApiResponse } from '@/types/api';
import { AuthUtils } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export class ApiHelper {
  static createUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return BASE_URL ? `${BASE_URL}/${cleanEndpoint}` : `/${cleanEndpoint}`;
  }

  static async fetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = this.createUrl(endpoint);
      console.log('API Request to:', url);
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const finalOptions: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, finalOptions);
      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!isJson) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        return {
          success: false,
          message: 'Server returned non-JSON response',
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || 'Request failed',
          errors: data?.errors,
        };
      }

      return {
        success: true,
        data: data?.data || data,
        message: data?.message,
      };

    } catch (error: any) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error.message || 'Network error',
      };
    }
  }

  static async authFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      ...options,
      headers: {
        ...AuthUtils.getAuthHeaders(),
        ...options.headers,
      },
    });
  }

  static async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.authFetch<T>(endpoint, { method: 'GET' });
  }

  static async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.authFetch<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.authFetch<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.authFetch<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.authFetch<T>(endpoint, { method: 'DELETE' });
  }
}