'use client';
import React, { useState, useEffect } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import PermissionModal from '@/components/pages/PermissionModel';
import { ApiHelper } from '@/utils/api';
import { AuthUtils } from '@/utils/auth';
import { Permission, CreatePermissionRequest } from '@/types/permission';

export default function PermissionManagementPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState<CreatePermissionRequest>({
    name: '',
    slug: '',
    description: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      if (!AuthUtils.isAuthenticated()) {
        alert('Vui lòng đăng nhập để xem trang này');
        window.location.href = '/login';
        return;
      }

      const response = await ApiHelper.get<Permission[]>('api/v1/permissions');
      
      if (response.success && response.data) {
        const permissionsData = Array.isArray(response.data) ? response.data : [];
        setPermissions(permissionsData);
      } else {
        console.error('Error fetching permissions:', response.message);
        alert(response.message || 'Không thể tải dữ liệu quyền hạn');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      alert('Lỗi khi tải quyền hạn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      width: '60px',
      sortable: true,
      className: 'text-center'
    },
    { 
      key: 'name', 
      label: 'TÊN QUYỀN HẠN',
      sortable: true,
      className: 'text-center'
    },
    { 
      key: 'slug', 
      label: 'SLUG',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      ),
      className: 'text-center'
    },
    { 
      key: 'description', 
      label: 'MÔ TẢ',
      sortable: false,
      render: (value: string | null) => (
        <span className="text-gray-600 text-sm">{value || '-'}</span>
      ),
      className: 'text-center'
    },
    {
      key: 'created_at',
      label: 'NGÀY TẠO',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
      className: 'text-center'
    },
    {
      key: 'actions',
      label: 'THAO TÁC',
      width: '120px',
      sortable: false,
      render: (_value: any, row: Permission) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Sửa"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            className="text-red-600 hover:text-red-800"
            title="Xóa"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      ),
      className: 'text-center'
    }
  ];

  const handleEdit = (permission: Permission) => {
    if (!permission || !permission.id) {
      console.error('Invalid permission data:', permission);
      alert('Dữ liệu quyền hạn không hợp lệ');
      return;
    }
    
    console.log('Editing permission:', permission);
    setEditingPermission(permission);
    setFormData({
      name: permission.name || '',
      slug: permission.slug || '',
      description: permission.description || null
    });
    setShowModal(true);
  };

  const handleDelete = async (permission: Permission) => {
    if (!permission || !permission.id) {
      console.error('Invalid permission data:', permission);
      alert('Dữ liệu quyền hạn không hợp lệ');
      return;
    }
    
    if (!confirm(`Bạn có chắc muốn xóa quyền hạn "${permission.name}"?`)) return;

    try {
      const response = await ApiHelper.delete(`api/v1/permissions/${permission.id}`);
      if (response.success) {
        alert('Xóa quyền hạn thành công!');
        fetchPermissions();
      } else {
        alert('Lỗi: ' + (response.message || 'Không thể xóa quyền hạn'));
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
      if (editingPermission) {
        const updateData: any = {
          name: formData.name,
          slug: formData.slug
        };
        
        if (formData.description && formData.description.trim() !== '') {
          updateData.description = formData.description;
        }
        
        console.log('Updating permission ID:', editingPermission.id);
        console.log('Update data:', JSON.stringify(updateData, null, 2));
        
        response = await ApiHelper.patch(`api/v1/permissions/${editingPermission.id}`, updateData);
        console.log('Update response:', response);
      } else {
        console.log('Creating permission:', formData);
        response = await ApiHelper.post('api/v1/permissions', formData);
        console.log('Create response:', response);
      }

      if (response.success) {
        alert(editingPermission ? 'Cập nhật thành công!' : 'Thêm quyền hạn thành công!');
        setShowModal(false);
        setEditingPermission(null);
        setFormData({
          name: '',
          slug: '',
          description: null
        });
        fetchPermissions();
      } else {
        console.error('API Error:', response);
        alert('Lỗi: ' + (response.message || 'Không thể lưu quyền hạn'));
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('Lỗi: ' + error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from name
    if (name === 'name' && !editingPermission) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const resetForm = () => {
    setEditingPermission(null);
    setFormData({
      name: '',
      slug: '',
      description: null
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Filter permissions based on search query
  const filteredPermissions = permissions.filter(permission => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return (
      permission.name.toLowerCase().includes(query) ||
      permission.slug.toLowerCase().includes(query) ||
      (permission.description && permission.description.toLowerCase().includes(query))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPermissions = filteredPermissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-gray-900">Danh sách Quyền hạn</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, slug, mô tả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    title="Xóa tìm kiếm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
              >
                Thêm quyền
              </button>
            </div>
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={currentPermissions}
          loading={loading}
          searchable={false}
          actionable={false}
          emptyText="Chưa có quyền hạn nào"
        />

        <div className="p-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-sm text-gray-600 font-medium">
            {searchQuery ? (
              <>Tìm thấy {filteredPermissions.length} / {permissions.length} quyền hạn</>
            ) : (
              <>Tổng quyền hạn: {permissions.length}</>
            )}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Trang trước"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`min-w-[36px] px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Trang sau"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <PermissionModal
        showModal={showModal}
        editingPermission={editingPermission}
        formData={formData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
      />
    </div>
  );
}