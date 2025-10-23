'use client';
import { useState, useEffect } from 'react';
import { ApiHelper } from '@/utils/api';
import { AuthUtils } from '@/utils/auth';
import { Customer } from '@/types/customer';

declare global {
  interface Window {
    XLSX: any;
  }
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [xlsxLoaded, setXlsxLoaded] = useState(false);
  const itemsPerPage = 10;

  // Load thư viện XLSX
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.XLSX) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => setXlsxLoaded(true);
      document.head.appendChild(script);
    } else if (window.XLSX) {
      setXlsxLoaded(true);
    }
  }, []);

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      if (!AuthUtils.isAuthenticated()) {
        alert('Vui lòng đăng nhập');
        window.location.href = '/login';
        return;
      }

      const response = await ApiHelper.get<any>('api/v1/customers');

      // Xử lý 2 trường hợp: có hoặc không có { success, data }
      if (response.success && Array.isArray(response.data)) {
        setCustomers(response.data);
      } else if (Array.isArray(response)) {
        setCustomers(response);
      } else {
        console.error('Dữ liệu trả về không hợp lệ:', response);
        alert('Không thể tải danh sách khách hàng.');
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Lỗi khi tải khách hàng');
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (!window.XLSX) {
      alert('Đang tải thư viện Excel, vui lòng thử lại sau.');
      return;
    }

    if (customers.length === 0) {
      alert('Không có dữ liệu để xuất Excel.');
      return;
    }

    const exportData = filteredCustomers.map(c => ({
      'ID': c.id,
      'Tên khách hàng': c.name,
      'Email': c.email || '',
      'Số điện thoại': c.phone || '',
      'Địa chỉ': c.address || '',
      'Số đơn hàng': c.order_count ?? 0,
      'Tổng chi tiêu': c.total_spent ?? 0,
      'Ngày đơn cuối': c.last_order_date || ''
    }));

    const worksheet = window.XLSX.utils.json_to_sheet(exportData);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 30 },
      { wch: 25 },
      { wch: 15 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 }
    ];

    const fileName = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
    window.XLSX.writeFile(workbook, fileName);
  };

  // Import Excel (chưa triển khai)
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    alert('Chức năng import khách hàng chưa được triển khai.');
    e.target.value = '';
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      customer.name.toLowerCase().includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.includes(query))
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Load dữ liệu khi mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    filteredCustomers,
    currentCustomers,
    loading,
    currentPage,
    searchQuery,
    xlsxLoaded,
    totalPages,
    itemsPerPage,
    setSearchQuery,
    setCurrentPage,
    fetchCustomers,
    handleExportExcel,
    handleImportExcel
  };
}