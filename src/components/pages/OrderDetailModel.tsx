'use client';
import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { useOrders } from '@/hooks/useOrder';

interface OrderDetailModalProps {
  show: boolean;
  order: Order | null;
  onClose: () => void;
  permissions: { canUpdateStatus: boolean };
}

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

export default function OrderDetailModal({ show, order, onClose, permissions }: OrderDetailModalProps) {
  const { updateOrderStatus } = useOrders();
  const [loading, setLoading] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');

  if (!show || !order) return null;

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(amount));
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xử lý' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xác nhận' },
      processing: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Đang xử lý' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đã giao hàng' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoàn tất' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã hủy' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // Hàm ánh xạ trạng thái thanh toán sang tiếng Việt
  const getPaymentStatusLabel = (status: string | null | undefined) => {
    const paymentStatuses: Record<string, string> = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại', // Thêm trạng thái khác nếu cần
    };
    return paymentStatuses[status?.toLowerCase() || ''] || 'Chưa xác định';
  };

  const openReasonModal = () => {
    setReason('');
    setShowReasonModal(true);
  };

  const handleReasonSubmit = async () => {
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn');
      return;
    }
    setShowReasonModal(false);
    setLoading(true);
    try {
      await updateOrderStatus(order.id, 'cancelled');
      onClose();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Lỗi khi hủy đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: OrderStatus) => {
    setLoading(true);
    try {
      await updateOrderStatus(order.id, status);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Lỗi khi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  // Xác định workflow hiện tại
  const showConfirmSection = permissions.canUpdateStatus && order.order_status === 'pending';
  const showProcessingSection = permissions.canUpdateStatus && order.order_status === 'confirmed';
  const showShippingSection = permissions.canUpdateStatus && order.order_status === 'processing';
  const showCompleteSection = permissions.canUpdateStatus && order.order_status === 'shipped';

  const statusHistory = [
    { key: 'confirmed_at', label: 'Xác nhận', value: order.confirmed_at },
    { key: 'shipped_at', label: 'Giao hàng', value: order.shipped_at },
    { key: 'delivered_at', label: 'Giao thành công', value: order.delivered_at },
    { key: 'cancelled_at', label: 'Hủy đơn', value: order.cancelled_at },
  ].filter(item => item.value);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {order.order_number || order.order_code || `ĐH #${order.id}`}
                </h2>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.order_status)}
                  <span className="text-blue-100 text-sm">ID: #{order.id}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
            {/* General Info */}
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Ngày đặt hàng" value={formatDate(order.order_date)} />
              <InfoCard label="Khách hàng" value={order.customer_name || order.customer_real_name || 'N/A'} />
              <InfoCard label="Số điện thoại" value={order.customer_phone || 'Chưa có'} />
              <InfoCard label="Tổng tiền" value={formatCurrency(order.total_amount)} />
              <InfoCard label="Phương thức thanh toán" value={order.payment_method || 'Chưa xác định'} />
              <InfoCard label="Trạng thái thanh toán" value={getPaymentStatusLabel(order.payment_status)} /> {/* Sử dụng hàm mới */}
            </div>

            {/* Địa chỉ giao hàng */}
            {order.shipping_address && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-sm font-semibold text-blue-800 mb-1">Địa chỉ giao hàng:</p>
                <p className="text-sm text-blue-700">
                  {order.shipping_address}
                  {order.shipping_ward && `, ${order.shipping_ward}`}
                  {order.shipping_district && `, ${order.shipping_district}`}
                  {order.shipping_province && `, ${order.shipping_province}`}
                </p>
              </div>
            )}

            {/* Ghi chú */}
            {order.notes && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <p className="text-sm font-semibold text-amber-800 mb-1">Ghi chú:</p>
                <p className="text-sm text-amber-700">{order.notes}</p>
              </div>
            )}

            {/* Lý do hủy */}
            {order.order_status === 'cancelled' && order.cancel_reason && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-sm font-semibold text-red-800 mb-1">Lý do hủy:</p>
                <p className="text-sm text-red-700">{order.cancel_reason}</p>
              </div>
            )}

            {/* Chi tiết sản phẩm */}
            {order.items && order.items.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Chi tiết sản phẩm</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sản phẩm</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Số lượng</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Đơn giá</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.product_sku}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                            {item.batch_number && (
                              <div className="text-xs text-gray-500">Lô: {item.batch_number}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-700">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-blue-700">
                            {formatCurrency(Number(item.unit_price) * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lịch sử trạng thái */}
            {statusHistory.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Lịch sử trạng thái</h4>
                <div className="space-y-2">
                  {statusHistory.map((item) => (
                    <div key={item.key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-900">{formatDate(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workflow 1: Xác nhận đơn hàng (pending → confirmed) */}
            {showConfirmSection && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">Xem xét và xác nhận/hủy đơn hàng từ khách hàng</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Xác nhận đơn
                  </button>
                  <button
                    onClick={openReasonModal}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-red-300 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy đơn
                  </button>
                </div>
              </div>
            )}

            {/* Workflow 2: Bắt đầu xử lý (confirmed → processing) */}
            {showProcessingSection && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">

                <p className="text-sm text-gray-600 mb-4">Chuẩn bị hàng và bắt đầu xử lý đơn hàng</p>
                <button
                  onClick={() => handleUpdateStatus('processing')}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                   Bắt đầu xử lý
                </button>
              </div>
            )}

            {/* Workflow 3: Giao hàng (processing → shipped) */}
            {showShippingSection && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                {/* <h4 className="font-semibold text-purple-900 mb-3">📦 Workflow 3: Xác nhận giao hàng</h4> */}
                <p className="text-sm text-gray-600 mb-4">Xác nhận đơn hàng đã được giao cho đơn vị vận chuyển</p>
                <button
                  onClick={() => handleUpdateStatus('shipped')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                   Xác nhận đã giao hàng
                </button>
              </div>
            )}

            {/* Workflow 4: Hoàn tất (shipped → completed) */}
            {showCompleteSection && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                {/* <h4 className="font-semibold text-green-900 mb-3">🎉 Workflow 4: Hoàn tất đơn hàng</h4> */}
                <p className="text-sm text-gray-600 mb-4">Xác nhận khách hàng đã nhận hàng thành công</p>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                   Xác nhận hoàn tất
                </button>
              </div>
            )}

            {/* No actions */}
            {!showConfirmSection && !showProcessingSection && !showShippingSection && !showCompleteSection && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  {order.order_status === 'completed' ? (
                    <> Đơn hàng đã hoàn tất</>
                  ) : order.order_status === 'cancelled' ? (
                    <> Đơn hàng đã bị hủy</>
                  ) : (
                    <> Không có thao tác khả dụng</>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lý do hủy đơn hàng
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập lý do hủy đơn..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowReasonModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReasonSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}