'use client';
import React, { useState } from 'react';
import { Order } from '@/types/order'; // Thêm import Order
import OrderKanbanBoard from '@/components/PageLayout/orders/OrderKanban';
import OrderDetailModal from '@/components/pages/OrderDetailModel';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Thêm kiểu dữ liệu

  const handleCardClick = (order: Order) => { // Thêm kiểu dữ liệu cho parameter
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };
    
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Cài đặt' },
    { label: 'Quản lý đơn hàng' }
  ];


  return (
    <div>
    <Breadcrumb items={breadcrumbItems} />
    <div className="min-h-screen bg-gray-100">
 
      <h1 className="text-2xl font-bold p-6">Quản lý đơn hàng</h1>
      <OrderKanbanBoard onCardClick={handleCardClick} />
      {selectedOrder && (
        <OrderDetailModal
          show={!!selectedOrder}
          order={selectedOrder}
          onClose={handleCloseModal}
          permissions={{ canUpdateStatus: true }}
        />
      )}
    </div>
    </div>
  );
}