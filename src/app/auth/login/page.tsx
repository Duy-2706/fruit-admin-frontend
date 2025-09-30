// src/app/(auth)/login/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    
    const newErrors: {username?: string; password?: string} = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - replace with real API call
      if (formData.username === 'admin' && formData.password === 'password') {
        // Store auth token (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify({
            id: 1,
            name: 'Kruluz Utsman',
            email: 'admin@zarvis.com',
            role: 'admin'
          }));
        }
        
        router.push('/dashboard');
      } else {
        setErrors({ password: 'Invalid username or password' });
      }
    } catch (error) {
      setErrors({ password: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
          
          {/* Left side - Illustration */}
          <div className="hidden lg:flex items-center justify-center bg-white rounded-3xl p-12 shadow-lg">
            <div className="text-center max-w-md">
              {/* Innovation Illustration */}
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto relative">
                  {/* Light bulb */}
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Bulb outline */}
                      <circle cx="100" cy="80" r="45" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                      {/* Filament */}
                      <path d="M70 60 Q100 40 130 60 Q100 80 70 60" fill="none" stroke="#f97316" strokeWidth="2"/>
                      <path d="M75 75 Q100 55 125 75" fill="none" stroke="#f97316" strokeWidth="2"/>
                      {/* Base */}
                      <rect x="85" y="125" width="30" height="15" fill="#9ca3af" rx="2"/>
                      <rect x="88" y="140" width="24" height="8" fill="#6b7280" rx="1"/>
                      
                      {/* Person with ladder */}
                      <g transform="translate(140, 100)">
                        {/* Ladder */}
                        <line x1="10" y1="0" x2="10" y2="60" stroke="#4b5563" strokeWidth="2"/>
                        <line x1="20" y1="0" x2="20" y2="60" stroke="#4b5563" strokeWidth="2"/>
                        {/* Rungs */}
                        {[0, 12, 24, 36, 48].map(y => (
                          <line key={y} x1="10" y1={y} x2="20" y2={y} stroke="#4b5563" strokeWidth="1"/>
                        ))}
                        {/* Person on ladder */}
                        <circle cx="25" cy="20" r="6" fill="#3b82f6"/>
                        <rect x="20" y="26" width="10" height="18" fill="#3b82f6" rx="2"/>
                        <line x1="15" y1="35" x2="35" y2="30" stroke="#3b82f6" strokeWidth="2"/>
                      </g>
                      
                      {/* Person working on ground */}
                      <g transform="translate(40, 130)">
                        <circle cx="10" cy="10" r="6" fill="#f97316"/>
                        <rect x="5" y="16" width="10" height="18" fill="#f97316" rx="2"/>
                        <line x1="0" y1="25" x2="20" y2="25" stroke="#f97316" strokeWidth="2"/>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Welcome to Innovation</h2>
                <p className="text-gray-600">
                  Collaborate, create, and manage your business with our powerful admin platform.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <div className="text-center mb-8">
                {/* Logo */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">FRESH FOOD</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  error={errors.username}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center mb-2">Demo credentials:</p>
                <p className="text-xs text-gray-700 text-center">
                  Username: <code className="bg-gray-200 px-1 rounded">admin</code> | 
                  Password: <code className="bg-gray-200 px-1 rounded ml-1">password</code>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;