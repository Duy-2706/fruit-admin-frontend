'use client';
import React from 'react';

interface AdminNavigationProps {
  activeSection: string;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ activeSection }) => {
  const getSectionInfo = (section: string) => {
    const sections: Record<string, { title: string; description: string }> = {
      dashboard: { 
        title: 'Dashboard', 
        description: 'Tổng quan hệ thống'
      },
      products: { 
        title: 'Quản lý sản phẩm', 
        description: 'Quản lý các sản phẩm trên website'
      },
      categories: { 
        title: 'Quản lý Danh mục', 
        description: 'Quản lý các danh mục sản phẩm trên website'
      },
      customers: { 
        title: 'Quản lý khách hàng', 
        description: 'Quản lý thông tin khách hàng'
      },
      banners: { 
        title: 'Danh sách Banner', 
        description: 'Danh sách các banner hiển thị trên website'
      },
      reports: { 
        title: 'Báo cáo thống kê', 
        description: 'Xem báo cáo và thống kê hệ thống'
      },
    };
    return sections[section] || { title: 'Dashboard', description: 'Tổng quan hệ thống' };
  };

  const sectionInfo = getSectionInfo(activeSection);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div>
        <h1 className="text-sm font-normal text-gray-900">
          {sectionInfo.title}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {sectionInfo.description}
        </p>
      </div>
    </div>
  );
};

export default AdminNavigation;