'use client';
import React from 'react';
import CustomerHeader, { CustomerTable } from '@/components/PageLayout/customers/CustomerLayout';
import { useCustomers } from '@/hooks/useCustomer';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function CustomersPage() {
  const {
    customers,
    loading,
    currentPage,
    searchQuery,
    filteredCustomers,
    currentCustomers,
    totalPages,
    itemsPerPage,
    xlsxLoaded,
    setSearchQuery,
    setCurrentPage,
    fetchCustomers,
    handleExportExcel,
    handleImportExcel
  } = useCustomers();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Quản lý người dùng' },
    { label: 'Quản lý khách hàng' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header giống Supplier */}
        <CustomerHeader
          totalCount={customers.length}
          filteredCount={filteredCustomers.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImport={handleImportExcel}
          onExport={handleExportExcel}
          onRefresh={fetchCustomers}
          xlsxLoaded={xlsxLoaded}
        />

        {/* Bảng danh sách khách hàng */}
        <CustomerTable
          customers={currentCustomers}
          loading={loading}
        />

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600 font-medium">
            {searchQuery ? (
              <>Tìm thấy {filteredCustomers.length} / {customers.length} khách hàng</>
            ) : (
              <>Tổng: {customers.length} khách hàng</>
            )}
          </span>

          <div className="flex items-center space-x-2">
            {/* Nút Trước */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Số trang */}
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

            {/* Nút Sau */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
