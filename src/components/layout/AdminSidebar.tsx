'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  activeSection 
}) => {
  const pathname = usePathname();
  console.log('🔍 AdminSidebar:', { pathname, activeSection });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg> },
    { id: 'products', label: 'Quản lý sản phẩm', href: '/admin/products', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 0-8-3-8-6s3-6 8-6 8 3 8 6-3 6-8 6z"/><path d="M17 9v4a3 3 0 0 0 3-3 3 3 0 0 0-3-1z"/></svg> },
    { id: 'categories', label: 'Quản lý danh mục', href: '/admin/categories', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
    { id: 'customers', label: 'Quản lý khách hàng', href: '/admin/customers', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg> },
    { id: 'banners', label: 'Quản lý banner', href: '/admin/banners', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'reports', label: 'Báo cáo thống kê', href: '/admin/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => {
            console.log('🔍 Closing sidebar overlay');
            onToggle();
          }}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-30 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      } lg:w-64 lg:relative lg:shadow-none border-r border-gray-200`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ZARVIS</span>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => console.log(`🔗 Navigating to ${item.href}`)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  pathname === item.href || (item.id === activeSection && pathname.startsWith(item.href))
                    ? 'bg-teal-50 text-teal-600 border-r-3 border-teal-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${pathname === item.href || item.id === activeSection ? 'text-teal-600' : 'text-gray-400'} group-hover:text-gray-600`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;