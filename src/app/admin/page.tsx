'use client';
import React from 'react';
import { 
  TrendingUp,
  TrendingDown,
  Plus,
  User,
  Users
} from 'lucide-react';
import { ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from 'recharts';

export default function AdminDashboard() {
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

  const cryptoCards = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 9784.79,
      change: '+2%',
      positive: true,
      color: 'bg-yellow-500'
    },
    {
      id: 2,
      name: 'Ethereum', 
      symbol: 'ETH',
      price: 4741.19,
      change: '-5.2%',
      positive: false,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 4567.16,
      change: '+6.5%',
      positive: true,
      color: 'bg-orange-500'
    },
    {
      id: 4,
      name: 'Litecoin',
      symbol: 'LTC',
      price: 6547.79,
      change: '+8%',
      positive: true,
      color: 'bg-gray-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      crypto: 'Bitcoin',
      time: '10:45:16 AM',
      amount: '+1545.00',
      status: 'Completed',
      color: 'bg-yellow-500'
    },
    {
      id: 2,
      crypto: 'Ethereum',
      time: '09:15:31 AM', 
      amount: '+5649.00',
      status: 'Pending',
      color: 'bg-orange-500'
    },
    {
      id: 3,
      crypto: 'LTC',
      time: '09:01:12 AM',
      amount: '+4567.00',
      status: 'Completed',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title - Fixed */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      
      {/* Stats Cards - Fixed spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Orders</h3>
            <p className="text-3xl font-bold text-green-600">567</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">$89,432</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Products</h3>
            <p className="text-3xl font-bold text-orange-600">2,145</p>
          </div>
        </div>
      </div>

      {/* Crypto Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cryptoCards.map((card) => (
          <div key={card.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">{card.symbol.charAt(0)}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{card.symbol} = USD</p>
                <p className="text-2xl font-bold text-gray-900">{card.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center">
              {card.positive ? (
                <TrendingUp size={16} className="text-emerald-500 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${card.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
              <p className="text-emerald-500 font-medium">$376</p>
            </div>
            
            <div className="flex space-x-2">
              {['All', '1H', '6H', '1Y', 'YTD'].map((period) => (
                <button
                  key={period}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    period === 'All' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData}>
                <defs>
                  <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="sellGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="buy"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#buyGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="sell"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#sellGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center space-x-8 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Buy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Sell</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Balances Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Balances</h3>
              <button className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Plus size={16} className="text-white" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-500 text-sm">$ Dollar</p>
              <p className="text-3xl font-bold text-purple-600">9784.79</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-100 text-sm mb-1">**** **** **** 2290</p>
                  <p className="text-white font-medium">ZARVIS CARD</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-100">12/26</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Team</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Total Admin</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Team Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
        
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${activity.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">{activity.crypto.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.crypto}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-emerald-500">{activity.amount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'Completed' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}