'use client';
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  TrendingUp,
  Plus,
  Users
} from 'lucide-react';
import { ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from 'recharts';

const Dashboard = () => {
  const marketData = [
    { time: '9AM', buy: 320, sell: 280 },
    { time: '10AM', buy: 350, sell: 290 },
    { time: '11AM', buy: 380, sell: 320 },
    { time: '12PM', buy: 376, sell: 300 },
    { time: '1PM', buy: 420, sell: 340 },
    { time: '2PM', buy: 450, sell: 380 },
    { time: '3PM', buy: 430, sell: 360 },
    { time: '4PM', buy: 480, sell: 400 },
  ];

  return (
    <AdminLayout activeSection="dashboard" pageTitle="Dashboard">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng doanh thu</span>
              <TrendingUp className="text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">$12,345</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Người dùng</span>
              <Users className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">1,234</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đơn hàng</span>
              <TrendingUp className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold mt-2">567</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Banner</span>
              <Plus className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold mt-2">25</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Biểu đồ thị trường</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={marketData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Area type="monotone" dataKey="buy" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="sell" stroke="#F87171" fill="#F87171" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;