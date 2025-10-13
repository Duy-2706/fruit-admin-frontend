// 'use client';
// import React, { useState, useEffect } from 'react';
// import CustomTable from '@/components/ui/CustomTable';
// import { ApiHelper } from '@/utils/api';

// const BannerManagement = () => {
//   const [bannerData, setBannerData] = useState<any[]>([]);

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const fetchBanners = async () => {
//     try {
//     const response = await ApiHelper.authFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/banners/manage`, {
//       method: 'GET',
//     });
//     console.log('API Response:', response); // Xem toàn bộ response
//     if (response.success) {
//       console.log('Dữ liệu banner:', response.data); // Xem dữ liệu cụ thể
//       setBannerData(response.data || []);
//     } else {
//       console.error('Lỗi API:', response.message);
//     }
//   } catch (error) {
//     console.error('Lỗi kết nối:', error);
//   }
//   };

//   const columnNames = ['ID', 'Title', 'Status', 'CreatedAt'];

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Banner</h1>
//       <CustomTable
//         columnNames={columnNames}
//         data={bannerData}
//         onRowClick={(item) => console.log('Clicked row:', item)}
//       />
//     </div>
//   );
// };

// export default BannerManagement;