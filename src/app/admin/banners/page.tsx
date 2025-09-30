'use client';
import React, { useState, useEffect } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import { ApiHelper } from '@/utils/api';
import { AuthUtils } from '@/utils/auth';
import { Banner, CreateBannerRequest, UpdateBannerRequest } from '@/types/banner';

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<CreateBannerRequest>({
    title: '',
    image: '',
    link: '',
    position: 'homepage-main',
    sort_order: 0,
    is_active: true
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      if (!AuthUtils.isAuthenticated()) {
        alert('Vui lòng đăng nhập để xem trang này');
        window.location.href = '/login';
        return;
      }

      const response = await ApiHelper.get<Banner[]>('api/v1/banners/manage');
      
      if (response.success && response.data) {
        const bannersData = Array.isArray(response.data) ? response.data : [];
        setBanners(bannersData);
      } else {
        console.error('Error fetching banners:', response.message);
        alert(response.message || 'Không thể tải dữ liệu banner');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Lỗi khi tải banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      width: '60px',
      sortable: true
    },
    {
      key: 'image',
      label: 'Hình ảnh',
      width: '120px',
      sortable: false,
      render: (value: string) => (
        <img 
          src={value} 
          alt="Banner" 
          className="w-20 h-12 object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.png';
          }}
        />
      )
    },
    { 
      key: 'title', 
      label: 'Tiêu đề',
      sortable: true
    },
    { 
      key: 'position', 
      label: 'Vị trí',
      width: '150px',
      sortable: true,
      render: (value: string) => {
        const positionMap: Record<string, string> = {
          'homepage-main': 'Trang chủ - Chính',
          'homepage-sidebar': 'Trang chủ - Sidebar',
          'category-top': 'Danh mục - Top',
        };
        return positionMap[value] || value;
      }
    },
    { 
      key: 'sort_order', 
      label: 'Thứ tự',
      width: '80px',
      sortable: true
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      width: '120px',
      sortable: true,
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Hoạt động' : 'Tạm dừng'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN')
    }
  ];

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      image: banner.image,
      link: banner.link || '',
      position: banner.position,
      sort_order: banner.sort_order,
      is_active: banner.is_active,
      start_date: banner.start_date,
      end_date: banner.end_date
    });
    setShowModal(true);
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`Bạn có chắc muốn xóa banner "${banner.title}"?`)) return;

    try {
      const response = await ApiHelper.delete(`api/v1/banners/manage/${banner.id}`);
      if (response.success) {
        alert('Xóa banner thành công!');
        fetchBanners();
      } else {
        alert('Lỗi: ' + (response.message || 'Không thể xóa banner'));
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Lỗi: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingBanner) {
        const updateData: UpdateBannerRequest = {
          title: formData.title,
          image: formData.image,
          link: formData.link || undefined,
          position: formData.position,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
          start_date: formData.start_date,
          end_date: formData.end_date
        };
        response = await ApiHelper.put(`api/v1/banners/manage/${editingBanner.id}`, updateData);
      } else {
        response = await ApiHelper.post('api/v1/banners/manage', formData);
      }

      if (response.success) {
        alert(editingBanner ? 'Cập nhật thành công!' : 'Thêm banner thành công!');
        setShowModal(false);
        setEditingBanner(null);
        setFormData({
          title: '',
          image: '',
          link: '',
          position: 'homepage-main',
          sort_order: 0,
          is_active: true
        });
        fetchBanners();
      } else {
        alert('Lỗi: ' + (response.message || 'Không thể lưu banner'));
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('Lỗi: ' + error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      image: '',
      link: '',
      position: 'homepage-main',
      sort_order: 0,
      is_active: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách Banner</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                + Thêm Banner
              </button>
            </div>
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={banners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchable={false}
          actionable={true}
          emptyText="Chưa có banner nào"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề banner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL hình ảnh <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="mt-2 w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link đích (tùy chọn)
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="homepage-main">Trang chủ - Chính</option>
                  <option value="homepage-sidebar">Trang chủ - Sidebar</option>
                  <option value="category-top">Danh mục - Top</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thứ tự sắp xếp <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-gray-500">Số nhỏ hơn sẽ hiển thị trước</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Kích hoạt banner (hiển thị ngay lập tức)
                </label>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingBanner ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}