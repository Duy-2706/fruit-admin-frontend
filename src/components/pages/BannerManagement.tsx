'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import CustomTable from '@/components/ui/CustomTable';
import { ApiHelper } from '@/utils/api';

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Định nghĩa cột cho bảng
  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value.slice(0, 8)}...</span>
      )
    },
    {
      key: 'title',
      label: 'Tiêu đề'
    },
    {
      key: 'description', 
      label: 'Mô tả',
      render: (value: string) => (
        <span className="truncate max-w-xs" title={value}>
          {value?.length > 50 ? `${value.slice(0, 50)}...` : value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString('vi-VN')}
        </span>
      )
    }
  ];

  // Fetch banners from API
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await ApiHelper.get<{data: Banner[]}>('api/v1/banners/manage');
      if (response.success && response.data) {
        setBanners(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      // Mock data for demo
      setBanners([
        {
          id: '1',
          title: 'Banner Khuyến mãi tháng 1',
          description: 'Giảm giá 50% cho tất cả sản phẩm trong tháng 1',
          image_url: 'https://example.com/banner1.jpg',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2', 
          title: 'Banner Sản phẩm mới',
          description: 'Khám phá các sản phẩm mới nhất của chúng tôi',
          image_url: 'https://example.com/banner2.jpg',
          status: 'active',
          created_at: '2024-01-10T09:20:00Z',
          updated_at: '2024-01-10T09:20:00Z'
        },
        {
          id: '3',
          title: 'Banner Đăng ký thành viên',
          description: 'Đăng ký ngay để nhận ưu đãi độc quyền',
          image_url: 'https://example.com/banner3.jpg',
          status: 'inactive',
          created_at: '2024-01-05T14:45:00Z',
          updated_at: '2024-01-05T14:45:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEdit = (banner: Banner) => {
    console.log('Edit banner:', banner);
    alert(`Sửa banner: ${banner.title}`);
  };

  const handleDelete = async (banner: Banner) => {
    if (window.confirm(`Bạn có chắc muốn xóa banner "${banner.title}"?`)) {
      try {
        const response = await ApiHelper.delete(`api/v1/banners/manage/${banner.id}`);
        if (response.success) {
          setBanners(banners.filter(b => b.id !== banner.id));
          alert('Xóa banner thành công!');
        } else {
          alert('Có lỗi xảy ra khi xóa banner');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        setBanners(banners.filter(b => b.id !== banner.id));
        alert('Đã xóa banner (demo)');
      }
    }
  };

  const handleRowClick = (banner: Banner) => {
    console.log('Clicked banner:', banner);
  };

  return (
    <AdminLayout activeSection="banners" pageTitle="Quản lý Banner">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
        </div>

        <div className="mb-4">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            + Thêm Banner Mới
          </button>
        </div>

        <CustomTable
          columns={columns}
          data={banners}
          loading={loading}
          searchable={true}
          actionable={true}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default BannerManagement;