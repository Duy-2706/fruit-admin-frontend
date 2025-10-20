'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStockChecks } from '@/hooks/useStockCheck';
import { StockCheck } from '@/types/inventory';

export default function StockCheckDetailPage() {
  const router = useRouter();
  const params = useParams();
  const checkId = parseInt(params.id as string);

  const {
    getStockCheckDetail,
    completeStockCheck,
    cancelStockCheck,
    updateItemQuantity,
    removeItemFromCheck
  } = useStockChecks();

  const [check, setCheck] = useState<StockCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<number>(0);

  useEffect(() => {
    loadCheckDetail();
  }, [checkId]);

  const loadCheckDetail = async () => {
    setLoading(true);
    const data = await getStockCheckDetail(checkId);
    setCheck(data);
    setLoading(false);
  };

  const handleComplete = async () => {
    if (!confirm('Xác nhận hoàn thành phiếu kiểm? Tồn kho sẽ được cập nhật.')) return;
    
    const success = await completeStockCheck(checkId);
    if (success) {
      router.push('/admin/inventory/stock-checks');
    }
  };

  const handleCancel = async () => {
    const success = await cancelStockCheck(checkId);
    if (success) {
      router.push('/admin/inventory/stock-checks');
    }
  };

  const handleEditItem = (itemId: number, currentQty: number) => {
    setEditingItemId(itemId);
    setEditingQuantity(currentQty);
  };

  const handleSaveEdit = async (itemId: number) => {
    const success = await updateItemQuantity(checkId, itemId, editingQuantity);
    if (success) {
      setEditingItemId(null);
      loadCheckDetail();
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm('Xóa sản phẩm này khỏi phiếu kiểm?')) return;
    
    const success = await removeItemFromCheck(checkId, itemId);
    if (success) {
      loadCheckDetail();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!check) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Không tìm thấy phiếu kiểm kho</p>
        <button
          onClick={() => router.push('/admin/inventory/stock-checks')}
          className="mt-4 text-emerald-600 hover:text-emerald-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusMap: { [key: string]: { label: string; color: string } } = {
    'pending': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    'in_progress': { label: 'Đang kiểm', color: 'bg-blue-100 text-blue-800' },
    'completed': { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    'cancelled': { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' }
  };

  const status = statusMap[check.status] || { label: check.status, color: 'bg-gray-100 text-gray-800' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Phiếu kiểm kho #{check.id}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Chi nhánh</p>
                <p className="font-medium text-gray-900">{check.branch_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Người kiểm</p>
                <p className="font-medium text-gray-900">{check.user_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày kiểm</p>
                <p className="font-medium text-gray-900">
                  {new Date(check.check_date).toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tổng sản phẩm</p>
                <p className="font-medium text-gray-900">{check.items?.length || 0}</p>
              </div>
            </div>

            {check.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ghi chú:</span> {check.notes}
                </p>
              </div>
            )}
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
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">
            Chi tiết sản phẩm đã kiểm
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tồn kho cũ</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số lượng đếm</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Chênh lệch</th>
                {check.status === 'in_progress' && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!check.items || check.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Chưa có sản phẩm nào trong phiếu kiểm
                  </td>
                </tr>
              ) : (
                check.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.sku}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.variant_name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{item.previous_quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingItemId === item.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editingQuantity}
                          onChange={(e) => setEditingQuantity(parseInt(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">{item.counted_quantity}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        item.adjustment > 0 
                          ? 'bg-green-100 text-green-800' 
                          : item.adjustment < 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.adjustment > 0 ? '+' : ''}{item.adjustment}
                      </span>
                    </td>
                    {check.status === 'in_progress' && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          {editingItemId === item.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="text-gray-600 hover:text-gray-800 text-sm"
                              >
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditItem(item.id, item.counted_quantity)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      {check.status === 'in_progress' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium"
            >
              Hủy phiếu kiểm
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
            >
              Hoàn thành & Cập nhật tồn kho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}