'use client';
import { useState, useEffect } from 'react';
import { Import, ImportStatus, KanbanColumn, CreateImportRequest, ApproveImportRequest } from '@/types/import';
import { ImportService } from '@/services/importService';
import { AuthUtils } from '@/utils/auth';

export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'requested',
    title: 'Chờ xử lý',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  {
    id: 'approved',
    title: 'Đã phê duyệt',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'paid',
    title: 'Đã thanh toán',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'completed',
    title: 'Đã nhận hàng',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'rejected',
    title: 'Từ chối',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'cancelled',
    title: 'Đã hủy',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
];

export function useImports() {
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImport, setSelectedImport] = useState<Import | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchImports = async () => {
    setLoading(true);
    try {
      if (!AuthUtils.isAuthenticated()) {
        alert('Vui lòng đăng nhập');
        window.location.href = '/login';
        return;
      }
      
      const response = await ImportService.getAll(1, 100);
      
      if (response.success && response.data) {
        setImports(Array.isArray(response.data) ? response.data : []);
      } else {
        alert(response.message || 'Không thể tải dữ liệu phiếu nhập');
      }
    } catch (error) {
      console.error('Error fetching imports:', error);
      alert('Lỗi khi tải phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  const getImportById = async (id: string) => {
    try {
      const response = await ImportService.getById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching import detail:', error);
      return null;
    }
  };

  const createImportRequest = async (data: CreateImportRequest) => {
    try {
      const response = await ImportService.createRequest(data);
      if (response.success) {
        alert('Tạo yêu cầu nhập hàng thành công!');
        fetchImports();
        return true;
      }
      alert('Lỗi: ' + (response.message || 'Không thể tạo yêu cầu'));
      return false;
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Lỗi: ' + error.message);
      return false;
    }
  };

  const reviewImport = async (id: string, data: ApproveImportRequest) => {
    try {
      const response = await ImportService.review(id, data);
      if (response.success) {
        alert(
          data.action === 'approve' ? 'Phê duyệt thành công!' :
          data.action === 'reject' ? 'Từ chối thành công!' :
          'Hủy thành công!'
        );
        fetchImports();
        return true;
      }
      alert('Lỗi: ' + (response.message || 'Không thể xử lý'));
      return false;
    } catch (error: any) {
      console.error('Review error:', error);
      alert('Lỗi: ' + error.message);
      return false;
    }
  };

  const confirmPayment = async (id: string): Promise<boolean> => {
    try {
      const response = await ImportService.confirmPayment(id);
      if (response.success) {
        alert('Xác nhận thanh toán thành công!');
        fetchImports();
        return true;
      }
      alert('Lỗi: ' + (response.message || 'Không thể xác nhận'));
      return false;
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Lỗi: ' + error.message);
      return false;
    }
  };

  const confirmReceive = async (id: string): Promise<boolean> => {
    try {
      const response = await ImportService.confirmReceive(id);
      if (response.success) {
        alert('Xác nhận nhận hàng thành công!');
        fetchImports();
        return true;
      }
      alert('Lỗi: ' + (response.message || 'Không thể xác nhận'));
      return false;
    } catch (error: any) {
      console.error('Receive error:', error);
      alert('Lỗi: ' + error.message);
      return false;
    }
  };

  const openDetailModal = async (importItem: Import) => {
    const detailData = await getImportById(importItem.id);
    if (detailData) {
      setSelectedImport(detailData);
      setShowDetailModal(true);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedImport(null);
  };

  const getImportsByStatus = (status: ImportStatus): Import[] => {
    return imports.filter(imp => imp.status === status);
  };

  useEffect(() => {
    fetchImports();
  }, []);

  return {
    imports,
    loading,
    selectedImport,
    showDetailModal,
    showCreateModal,
    setShowCreateModal,
    fetchImports,
    createImportRequest,
    reviewImport,
    confirmPayment,
    confirmReceive,
    openDetailModal,
    closeDetailModal,
    getImportsByStatus
  };
}