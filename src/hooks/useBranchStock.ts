'use client';
import { useState, useEffect } from 'react';
import { ApiHelper } from '@/utils/api';
import { AuthUtils } from '@/utils/auth';
import { BranchStock } from '@/types/inventory';

export function useBranchStock() {
  const [branchStock, setBranchStock] = useState<BranchStock[]>([]);
  const [branchName, setBranchName] = useState<string>('Đang tải...');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  // Lấy branch_id từ user đăng nhập
  const user = AuthUtils.getUser();
  const userBranchId = user?.branchId;

  // Fetch tồn kho của chi nhánh
  const fetchBranchStock = async (branchId: number) => {
    setLoading(true);
    try {
      if (!AuthUtils.isAuthenticated() || !branchId) {
        alert('Vui lòng đăng nhập và đảm bảo có thông tin chi nhánh!');
        setLoading(false);
        return;
      }
      const response = await ApiHelper.get<BranchStock[]>(`api/v1/inventory/branches/${branchId}`);
      if (response.success && response.data) {
        setBranchStock(Array.isArray(response.data) ? response.data : []);
      } else {
        alert(response.message || 'Không thể tải dữ liệu tồn kho');
      }
    } catch (error) {
      console.error('Error fetching branch stock:', error);
      alert('Lỗi khi tải tồn kho chi nhánh');
    } finally {
      setLoading(false);
    }
  };

  // Fetch branch name
  const fetchBranchName = async (branchId: number) => {
    try {
      const response = await ApiHelper.get<{ name: string }>(`api/v1/branches/${branchId}`);
      if (response.success && response.data) {
        setBranchName(response.data.name);
      } else {
        setBranchName('Không xác định');
      }
    } catch (error) {
      console.error('Error fetching branch name:', error);
      setBranchName('Không xác định');
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    if (typeof window === 'undefined' || !window.XLSX) {
      alert('Đang tải thư viện...');
      return;
    }
    const exportData = filteredBranchStock.map(item => ({
      'ID Biến thể': item.variant_id,
      'Tên Sản phẩm': item.product_name,
      'Biến thể': item.variant_name,
      'SKU': item.sku,
      'Số lượng': item.quantity
    }));
    const ws = window.XLSX.utils.json_to_sheet(exportData);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Tồn Kho Chi Nhánh");
    ws['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 12 }];
    window.XLSX.writeFile(wb, `ton-kho-chi-nhanh_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filter
  const filteredBranchStock = branchStock.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.product_name.toLowerCase().includes(query) ||
      item.variant_name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranchStock = filteredBranchStock.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBranchStock.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!userBranchId) {
      alert('Vui lòng đăng nhập và đảm bảo có thông tin chi nhánh!');
      setLoading(false);
    } else {
      fetchBranchName(userBranchId);
      fetchBranchStock(userBranchId);
    }
  }, [userBranchId]);

  return {
    branchStock,
    branchName,
    loading,
    currentPage,
    searchQuery,
    filteredBranchStock,
    currentBranchStock,
    totalPages,
    itemsPerPage,
    userBranchId,
    setSearchQuery,
    setCurrentPage,
    handleExportExcel
  };
}