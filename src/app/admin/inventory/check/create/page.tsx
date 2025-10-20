'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStockChecks } from '@/hooks/useStockCheck';
import { BranchStock } from '@/types/inventory';

export default function NewStockCheckPage() {
  const router = useRouter();
  const {
    branchStock,
    userBranchId,
    fetchBranchStock,
    createStockCheck,
    addItemToCheck
  } = useStockChecks();

  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [countedItems, setCountedItems] = useState<{ [variantId: number]: number }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userBranchId) {
      fetchBranchStock(userBranchId);
    }
  }, [userBranchId]);

  // Filter products
  const filteredStock = branchStock.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.product_name.toLowerCase().includes(query) ||
      item.variant_name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query)
    );
  });

  // Handle quantity input
  const handleQuantityChange = (variantId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    setCountedItems(prev => ({
      ...prev,
      [variantId]: quantity
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!userBranchId) {
      alert('Không tìm thấy thông tin chi nhánh');
      return;
    }

    // Validate có item nào được đếm chưa
    const itemsToSave = Object.entries(countedItems).filter(([_, qty]) => qty > 0);
    if (itemsToSave.length === 0) {
      alert('Vui lòng nhập số lượng kiểm cho ít nhất 1 sản phẩm');
      return;
    }

    if (!confirm(`Xác nhận tạo phiếu kiểm với ${itemsToSave.length} sản phẩm?`)) return;

    setSaving(true);
    try {
      // Bước 1: Tạo phiếu kiểm
      const checkData = await createStockCheck({
        branchId: userBranchId,
        notes: notes || 'Phiếu kiểm kho'
      });

      if (!checkData || !checkData.id) {
        alert('Lỗi khi tạo phiếu kiểm');
        return;
      }

      // Bước 2: Thêm từng item vào phiếu
      let successCount = 0;
      for (const [variantId, quantity] of itemsToSave) {
        const success = await addItemToCheck(checkData.id, parseInt(variantId), quantity);
        if (success) successCount++;
      }

      alert(`Đã thêm ${successCount}/${itemsToSave.length} sản phẩm vào phiếu kiểm`);
      
      // Chuyển sang trang chi tiết để hoàn thành
      router.push(`/admin/inventory/stock-checks/${checkData.id}`);

    } catch (error) {
      console.error('Submit error:', error);
      alert('Lỗi khi tạo phiếu kiểm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo phiếu kiểm kho mới</h1>
            <p className="text-sm text-gray-500 mt-1">
              Nhập số lượng thực tế đã kiểm cho từng sản phẩm
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Ghi chú về đợt kiểm kho này..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Danh sách hàng tồn kho ({filteredStock.length} sản phẩm)
            </h2>
            <div className="text-sm text-gray-600">
              Đã kiểm: <span className="font-semibold text-emerald-600">
                {Object.values(countedItems).filter(q => q > 0).length}
              </span> sản phẩm
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biến thể</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tồn kho hiện tại</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số lượng đã kiểm</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Chênh lệch</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm trong kho'}
                  </td>
                </tr>
              ) : (
                filteredStock.map((item) => {
                  const countedQty = countedItems[item.variant_id] || 0;
                  const adjustment = countedQty - item.quantity;
                  const hasAdjustment = countedQty > 0;

                  return (
                    <tr 
                      key={item.variant_id}
                      className={hasAdjustment ? 'bg-emerald-50' : 'hover:bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.sku}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{item.variant_name}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={countedItems[item.variant_id] || ''}
                          onChange={(e) => handleQuantityChange(item.variant_id, e.target.value)}
                          placeholder="Nhập SL"
                          className="w-24 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        {hasAdjustment && (
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            adjustment > 0 
                              ? 'bg-green-100 text-green-800' 
                              : adjustment < 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {adjustment > 0 ? '+' : ''}{adjustment}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || Object.values(countedItems).filter(q => q > 0).length === 0}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Đang lưu...' : 'Tạo phiếu kiểm'}
          </button>
        </div>
      </div>
    </div>
  );
}