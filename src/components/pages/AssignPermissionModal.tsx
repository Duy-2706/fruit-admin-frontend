import React, { useState, useEffect } from 'react';
import { Role } from '@/types/role';
import { Permission } from '@/types/permission';
import { ApiHelper } from '@/utils/api';

interface AssignPermissionModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (roleId: string, permissionId: string) => Promise<boolean>;
}

export default function AssignPermissionModal({
  showModal,
  onClose,
  onSubmit
}: AssignPermissionModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPermission, setSearchPermission] = useState('');

  useEffect(() => {
    if (showModal) {
      fetchRolesAndPermissions();
    }
  }, [showModal]);

  const fetchRolesAndPermissions = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        ApiHelper.get<Role[]>('api/v1/roles'),
        ApiHelper.get<Permission[]>('api/v1/permissions')
      ]);

      if (rolesRes.success && rolesRes.data) {
        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      }

      if (permissionsRes.success && permissionsRes.data) {
        setPermissions(Array.isArray(permissionsRes.data) ? permissionsRes.data : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoleId || !selectedPermissionId) {
      alert('Vui lòng chọn vai trò và quyền');
      return;
    }

    const success = await onSubmit(selectedRoleId, selectedPermissionId);
    
    if (success) {
      // Reset form
      setSelectedRoleId('');
      setSelectedPermissionId('');
      setSearchPermission('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedRoleId('');
    setSelectedPermissionId('');
    setSearchPermission('');
    onClose();
  };

  const filteredPermissions = permissions.filter(permission => {
    const query = searchPermission.toLowerCase().trim();
    if (!query) return true;
    
    return (
      permission.name.toLowerCase().includes(query) ||
      permission.slug.toLowerCase().includes(query)
    );
  });

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Gán quyền cho vai trò</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Chọn vai trò */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn vai trò <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn vai trò --</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Tìm kiếm quyền */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm quyền
              </label>
              <input
                type="text"
                placeholder="Tìm theo tên hoặc slug..."
                value={searchPermission}
                onChange={(e) => setSearchPermission(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Chọn quyền */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn quyền <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                {filteredPermissions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Không tìm thấy quyền nào
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredPermissions.map(permission => (
                      <label
                        key={permission.id}
                        className={`flex items-start p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedPermissionId === permission.id ? 'bg-emerald-50' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="permission"
                          value={permission.id}
                          checked={selectedPermissionId === permission.id}
                          onChange={(e) => setSelectedPermissionId(e.target.value)}
                          className="mt-1 mr-3 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {permission.name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {permission.slug}
                          </div>
                          {permission.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {permission.description}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Tìm thấy {filteredPermissions.length} / {permissions.length} quyền
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Gán quyền
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}