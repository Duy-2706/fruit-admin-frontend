// 'use client';
// import React, { useState } from 'react';
// import InventoryHeader, { InventoryTable } from '@/components/PageLayout/inventory/InventoryHeader';
// import InventoryModal from '@/components/pages/InventoryModel';
// import { useInventory } from '@/hooks/useInventory';
// import { InventoryItem, StockRequest } from '@/types/inventory';

// export default function InventoryPage() {
//   const {
//     inventory,
//     loading,
//     currentPage,
//     searchQuery,
//     filteredInventory,
//     currentInventory,
//     totalPages,
//     itemsPerPage,
//     xlsxLoaded,
//     setSearchQuery,
//     setCurrentPage,
//     deleteInventoryItem,
//     createInventoryCheck,
//     addCheckItem,
//     submitStockRequest,
//     handleExportExcel,
//     handleImportExcel
//   } = useInventory();

//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
//   const [formData, setFormData] = useState<StockRequest>({
//     variant_id: 0,
//     quantity: 1,
//     type: 'import',
//     reason: '',
//     branch_id: 0
//   });

//   const resetForm = () => {
//     setEditingItem(null);
//     setFormData({
//       variant_id: 0,
//       quantity: 1,
//       type: 'import',
//       reason: '',
//       branch_id: 0
//     });
//   };

//   const handleEdit = (item: InventoryItem) => {
//     setEditingItem(item);
//     setFormData({
//       variant_id: item.variant_id,
//       quantity: item.quantity,
//       type: 'import',
//       reason: '',
//       branch_id: 0
//     });
//     setShowModal(true);
//   };

//   const handleStockRequest = (type: 'import' | 'export') => {
//     if (!editingItem) {
//       setEditingItem({ variant_id: 0, quantity: 0, variant_name: '', sku: '', product_name: '' }); // Placeholder if no item selected
//     }
//     setFormData(prev => ({
//       ...prev,
//       type,
//       variant_id: editingItem?.variant_id || 0,
//       quantity: 1
//     }));
//     setShowModal(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const success = await submitStockRequest(formData);
//     if (success) {
//       setShowModal(false);
//       resetForm();
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'quantity' ? Number(value) : value
//     }));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <InventoryHeader
//           totalCount={inventory.length}
//           filteredCount={filteredInventory.length}
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           onImport={handleImportExcel}
//           onExport={handleExportExcel}
//           onAdd={() => {
//             resetForm();
//             createInventoryCheck({ branch_id: 0, notes: 'Kiểm kê mới' }); // Giả định branch_id
//           }}
//           onStockRequest={handleStockRequest}
//           xlsxLoaded={xlsxLoaded}
//         />

//         <InventoryTable
//           inventory={currentInventory}
//           allInventory={inventory}
//           loading={loading}
//           onEdit={handleEdit}
//           onDelete={deleteInventoryItem}
//         />

//         <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
//           <span className="text-sm text-gray-600 font-medium">
//             {searchQuery ? (
//               <>Tìm thấy {filteredInventory.length} / {inventory.length} sản phẩm</>
//             ) : (
//               <>Tổng: {inventory.length} sản phẩm</>
//             )}
//           </span>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setCurrentPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//             >
//               <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
            
//             <div className="flex items-center space-x-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                     currentPage === page
//                       ? 'bg-emerald-600 text-white shadow-sm'
//                       : 'text-gray-700 hover:bg-white'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={() => setCurrentPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//             >
//               <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       <InventoryModal
//         showModal={showModal}
//         editingItem={editingItem}
//         formData={formData}
//         onClose={() => {
//           setShowModal(false);
//           resetForm();
//         }}
//         onSubmit={handleSubmit}
//         onInputChange={handleInputChange}
//       />
//     </div>
//   );
// }