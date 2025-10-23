
'use client';
import React, { useState } from 'react';
import PermissionHeader, { PermissionTable } from '@/components/PageLayout/permissions/PermissionLayout';
import PermissionModal from '@/components/pages/PermissionModel';
import { usePermissions } from '@/hooks/usePermission';
import { Permission, CreatePermissionRequest } from '@/types/permission';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function permissionsPage() {
  const {
    permissions,
    loading,
    currentPage,
    searchQuery,
    filteredPermissions,
    currentPermissions,
    totalPages,
    itemsPerPage,
    xlsxLoaded,
    setSearchQuery,
    setCurrentPage,
    deletePermission,
    createPermission,
    updatePermission,
    handleExportExcel,
    handleImportExcel
  } = usePermissions();

      const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Cài đặt' },
    { label: 'Quản lý quyền hạn' }
  ];

  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState<CreatePermissionRequest>({
    name: '',
    slug: '',
    description: ''
  });

  const resetForm = () => {
    setEditingPermission(null);
    setFormData({
    name: '',
    slug: '',
    description: '',
    });
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name || '',
      slug: permission.slug || '',
      description: permission.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = editingPermission
      ? await updatePermission(editingPermission.id, formData)
      : await createPermission(formData);

    if (success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <PermissionHeader
          totalCount={permissions.length}
          filteredCount={filteredPermissions.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImport={handleImportExcel}
          onExport={handleExportExcel}
          onAdd={() => {
            resetForm();
            setShowModal(true);
          }}
          xlsxLoaded={xlsxLoaded}
        />

        <PermissionTable
          permissions={currentPermissions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deletePermission}
        />

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600 font-medium">
            Tổng: {filteredPermissions.length} quyền
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
      />
    </div>
  );
}