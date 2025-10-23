'use client';
import React, { useState } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import RoleModal from '@/components/pages/RoleModel';
import AssignPermissionModal from '@/components/pages/AssignPermissionModal';
import { useRoles } from '@/hooks/useRole';
import { Role, CreateRoleRequest } from '@/types/role';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function RoleManagementPage() {
  const {
    currentRoles,
    loading,
    currentPage,
    searchQuery,
    filteredRoles,
    roles,
    totalPages,
    setSearchQuery,
    setCurrentPage,
    createRole,
    updateRole,
    deleteRole,
    assignPermissionToRole
  } = useRoles();

        const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Cài đặt' },
    { label: 'Quản lý vai trò' }
  ];

  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: '',
    slug: '',
    description: null
  });

  const resetForm = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      slug: '',
      description: null
    });
  };

  const handleEdit = (role: Role) => {
    if (!role || !role.id) {
      alert('Dữ liệu vai trò không hợp lệ');
      return;
    }
    
    setEditingRole(role);
    setFormData({
      name: role.name || '',
      slug: role.slug || '',
      description: role.description || null
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = editingRole
      ? await updateRole(editingRole.id, formData)
      : await createRole(formData);

    if (success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from name when creating new role
    if (name === 'name' && !editingRole) {
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

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

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
      label: 'TÊN VAI TRÒ',
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
        <span className="text-gray-600">{value || '-'}</span>
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
      render: (_value: any, row: Role) => (
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
              deleteRole(row);
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

  return (
    <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-gray-900">Danh sách Vai trò</h2>
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
              
              {/* ✅ Nút Gán quyền */}
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Gán quyền
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
              >
                + Thêm Vai trò
              </button>
            </div>
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={currentRoles}
          loading={loading}
          searchable={false}
          actionable={false}
          emptyText="Chưa có vai trò nào"
        />

        <div className="p-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-sm text-gray-600 font-medium">
            {searchQuery ? (
              <>Tìm thấy {filteredRoles.length} / {roles.length} vai trò</>
            ) : (
              <>Tổng vai trò: {roles.length}</>
            )}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
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
                  onClick={() => setCurrentPage(page)}
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
              onClick={() => setCurrentPage(currentPage + 1)}
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

      {/* Modal thêm/sửa vai trò */}
      <RoleModal
        showModal={showModal}
        editingRole={editingRole}
        formData={formData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
      />

      {/* ✅ Modal gán quyền */}
      <AssignPermissionModal
        showModal={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSubmit={assignPermissionToRole}
      />
    </div>
  );
}