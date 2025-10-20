// 'use client';
// import React from 'react';
// import { InventoryItem, StockRequest } from '@/types/inventory';

// interface InventoryModalProps {
//   showModal: boolean;
//   editingItem: InventoryItem | null;
//   formData: StockRequest;
//   onClose: () => void;
//   onSubmit: (e: React.FormEvent) => void;
//   onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
// }

// export default function InventoryModal({
//   showModal,
//   editingItem,
//   formData,
//   onClose,
//   onSubmit,
//   onInputChange
// }: InventoryModalProps) {
//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold">
//             {editingItem ? 'Chỉnh sửa Sản phẩm' : formData.type === 'import' ? 'Phiếu Nhập Kho' : 'Phiếu Xuất Kho'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
        
//         <form onSubmit={onSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Sản phẩm <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="product_name"
//               value={editingItem ? `${editingItem.product_name} - ${editingItem.variant_name}` : ''}
//               disabled
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               placeholder="Tên sản phẩm"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Số lượng <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="quantity"
//               value={formData.quantity}
//               onChange={onInputChange}
//               required
//               min="1"
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               placeholder="Nhập số lượng"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Lý do <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               name="reason"
//               value={formData.reason}
//               onChange={onInputChange}
//               rows={3}
//               required
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               placeholder="Nhập lý do..."
//             />
//           </div>

//           <div className="flex space-x-3 pt-4 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Hủy
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
//             >
//               {editingItem ? 'Cập nhật' : formData.type === 'import' ? 'Nhập Kho' : 'Xuất Kho'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }