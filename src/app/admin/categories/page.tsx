'use client';
import React, { useState, useEffect } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import { ApiHelper } from '@/utils/api';
import { AuthUtils } from '@/utils/auth';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    slug: '',
    parent_id: null,
    description: '',
    image: '',
    sort_order: 0,
    is_active: true
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      if (!AuthUtils.isAuthenticated()) {
        alert('Vui lòng đăng nhập để xem trang này');
        window.location.href = '/login';
        return;
      }

      const response = await ApiHelper.get<Category[]>('api/v1/categories');
      
      if (response.success && response.data) {
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        setCategories(categoriesData);
      } else {
        console.error('Error fetching categories:', response.message);
        alert(response.message || 'Không thể tải dữ liệu danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

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
      width: '100px',
      sortable: false,
      render: (value: string | null) => (
        value ? (
          <img 
            src={value} 
            alt="Category" 
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.png';
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )
      )
    },
    { 
      key: 'name', 
      label: 'Tên danh mục',
      sortable: true
    },
    { 
      key: 'slug', 
      label: 'Slug',
      sortable: true,
      render: (value: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
      )
    },
    { 
      key: 'parent_id', 
      label: 'Danh mục cha',
      width: '150px',
      sortable: true,
      render: (value: string | null) => {
        if (!value) return <span className="text-gray-400">Gốc</span>;
        const parent = categories.find(c => c.id === value);
        return parent ? parent.name : <span className="text-gray-400">N/A</span>;
      }
    },
    { 
      key: 'sort_order', 
      label: 'Thứ tự',
      width: '80px',
      sortable: true,
      render: (value: number | null) => value ?? 0
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id,
      description: category.description || '',
      image: category.image || '',
      sort_order: category.sort_order || 0,
      is_active: category.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`)) return;

    try {
      const response = await ApiHelper.delete(`api/v1/categories/${category.id}`);
      if (response.success) {
        alert('Xóa danh mục thành công!');
        fetchCategories();
      } else {
        alert('Lỗi: ' + (response.message || 'Không thể xóa danh mục'));
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
      const submitData = {
        ...formData,
        parent_id: formData.parent_id || null,
        description: formData.description || null,
        image: formData.image || null,
        sort_order: formData.sort_order || 0
      };

      if (editingCategory) {
        const updateData: UpdateCategoryRequest = submitData;
        response = await ApiHelper.put(`api/v1/categories/${editingCategory.id}`, updateData);
      } else {
        response = await ApiHelper.post('api/v1/categories', submitData);
      }

      if (response.success) {
        alert(editingCategory ? 'Cập nhật thành công!' : 'Thêm danh mục thành công!');
        setShowModal(false);
        setEditingCategory(null);
        resetForm();
        fetchCategories();
      } else {
        alert('Lỗi: ' + (response.message || 'Không thể lưu danh mục'));
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('Lỗi: ' + error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      };

      // Auto-generate slug when name changes (only for new categories)
      if (name === 'name' && !editingCategory) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      parent_id: null,
      description: '',
      image: '',
      sort_order: 0,
      is_active: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách Danh mục</h2>
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
                + Thêm Danh mục
              </button>
            </div>
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchable={false}
          actionable={true}
          emptyText="Chưa có danh mục nào"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
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
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu-dong-tao-tu-ten"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {editingCategory ? 'Chỉnh sửa slug có thể ảnh hưởng đến SEO' : 'Tự động tạo từ tên danh mục'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục cha
                </label>
                <select
                  name="parent_id"
                  value={formData.parent_id || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Không có (danh mục gốc) --</option>
                  {categories
                    .filter(cat => cat.id !== editingCategory?.id)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả về danh mục (tùy chọn)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg (tùy chọn)"
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
                  Thứ tự sắp xếp
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
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
                  Kích hoạt danh mục (hiển thị trên website)
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
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}