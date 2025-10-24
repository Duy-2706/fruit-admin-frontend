'use client';
import React, { useState } from 'react';
import ProductHeader, { ProductTable } from '@/components/PageLayout/products/ProductLayout';
import ProductModal from '@/components/pages/ProductModal';
import ProductDetailModal from '@/components/pages/products/ProductDetailModel';
import { useProducts } from '@/hooks/useProduct';
// Đảm bảo import cả ProductImageStructure nếu bạn định nghĩa nó riêng
import { Product, CreateProductRequest, Category, Unit, ProductImageStructure } from '@/types/product';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function ProductsPage() {
  const {
    products,
    categories,
    units,
    loading,
    currentPage,
    searchQuery,
    filteredProducts,
    currentProducts,
    totalPages,
    // itemsPerPage, // Biến này dường như không được sử dụng, có thể bỏ nếu không cần
    xlsxLoaded,
    setSearchQuery,
    setCurrentPage,
    deleteProduct,
    createProduct,
    updateProduct,
    handleExportExcel,
    handleImportExcel
  } = useProducts();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Cài đặt' },
    { label: 'Quản lý sản phẩm' }
  ];

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);

  // --- 1. SỬA LẠI STATE images ---
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    slug: '',
    category_id: 0,
    unit_id: 0,
    price: 0,
    stock_quantity: 0,
    short_description: '',
    description: '',
    origin: 'Việt Nam',
    is_active: true,
    is_featured: false,
    images: { thumbnail: '', gallery: [] } // <-- Đổi thành object
  });

  // --- 2. SỬA LẠI resetForm ---
  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category_id: 0,
      unit_id: 0,
      price: 0,
      stock_quantity: 0,
      short_description: '',
      description: '',
      origin: 'Việt Nam',
      is_active: true,
      is_featured: false,
      images: { thumbnail: '', gallery: [] } // <-- Đổi thành object
    });
  };

  // --- 3. SỬA LẠI handleEdit ---
  const handleEdit = (product: Product) => {
    setEditingProduct(product);

    // --- SỬA: Thêm type annotation để tránh lỗi 'never[]' ---
    let imagesData: ProductImageStructure = { thumbnail: '', gallery: [] };
    // --- KẾT THÚC SỬA ---

    if (product.images) {
      // Logic cũ để xử lý images dạng mảng (string[]) - có thể bỏ nếu dữ liệu API luôn là object
      if (Array.isArray(product.images)) {
        console.warn("Product images are in old array format, converting..."); // Thêm cảnh báo
        imagesData.thumbnail = product.images[0] || '';
        imagesData.gallery = product.images.slice(1);
      }
      // Xử lý images dạng object mới
      else if (typeof product.images === 'object' && product.images !== null) {
        // Đảm bảo không gán undefined vào string/array
        imagesData.thumbnail = product.images.thumbnail || '';
        imagesData.gallery = product.images.gallery || [];
      }
    }

    setFormData({
      name: product.name,
      slug: product.slug,
      // Đảm bảo category_id và unit_id là number khi set vào form
      category_id: typeof product.category_id === 'string' ? parseInt(product.category_id, 10) : product.category_id,
      unit_id: typeof product.unit_id === 'string' ? parseInt(product.unit_id, 10) : product.unit_id,
      // Đảm bảo price là number
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      stock_quantity: product.stock_quantity,
      short_description: product.short_description || '', // Đảm bảo không phải null
      description: product.description || '', // Đảm bảo không phải null
      origin: product.origin || 'Việt Nam', // Đảm bảo không phải null
      is_active: product.is_active,
      is_featured: product.is_featured,
      images: imagesData, // <-- Gán object images đã xử lý
      compare_price: product.compare_price ? parseFloat(product.compare_price) : undefined,
      cost_price: product.cost_price ? parseFloat(product.cost_price) : undefined,
      weight: product.weight || '', // Đảm bảo không phải null
      is_fresh: product.is_fresh,
      shelf_life_days: product.shelf_life_days || 0, // Đảm bảo không phải null
      storage_conditions: product.storage_conditions || '', // Đảm bảo không phải null
      harvest_season: product.harvest_season || '', // Đảm bảo không phải null
      organic_certified: product.organic_certified,
      specifications: product.specifications
    });
    setShowModal(true);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_id || !formData.unit_id) {
      alert('Vui lòng chọn danh mục và đơn vị');
      return;
    }

    // Đảm bảo images luôn là object khi gửi đi
    const dataToSend = {
      ...formData,
      images: formData.images || { thumbnail: '', gallery: [] }
    };

    const success = editingProduct
      ? await updateProduct(editingProduct.id, dataToSend) // Gửi dataToSend
      : await createProduct(dataToSend); // Gửi dataToSend

    if (success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // Lấy checked riêng

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // --- 4. XÓA handleImagesChange VÀ THÊM 2 HÀM MỚI ---
  const handleThumbnailChange = (url: string) => {
    setFormData(prev => {
      // Đảm bảo prev.images là object trước khi spread
      const currentImages = (prev.images && typeof prev.images === 'object' && !Array.isArray(prev.images))
                             ? prev.images
                             : { thumbnail: '', gallery: [] };
      return {
        ...prev,
        images: {
          ...(currentImages as ProductImageStructure), // Cast về đúng kiểu
          thumbnail: url
        }
      };
    });
  };

  const handleGalleryChange = (urls: string[]) => {
    setFormData(prev => {
      // Đảm bảo prev.images là object trước khi spread
      const currentImages = (prev.images && typeof prev.images === 'object' && !Array.isArray(prev.images))
                             ? prev.images
                             : { thumbnail: '', gallery: [] };
      return {
        ...prev,
        images: {
          ...(currentImages as ProductImageStructure), // Cast về đúng kiểu
          gallery: urls
        }
      };
    });
  };

  const handleRowClick = (product: Product) => {
    // Chuyển ID sang string nếu nó là number or other type, ensure non-null
    setDetailProductId(product.id != null ? String(product.id) : null);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ProductHeader
          totalCount={products.length}
          filteredCount={filteredProducts.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImport={handleImportExcel}
          onExport={handleExportExcel}
          onAdd={() => {
            resetForm();
            setShowModal(true);
          }}
          xlsxLoaded={xlsxLoaded}
        />

        <ProductTable
          products={currentProducts}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteProduct}
          onRowClick={handleRowClick}
        />

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600 font-medium">
            {searchQuery ? `Tìm thấy ${filteredProducts.length} / ${products.length} sản phẩm` : `Tổng: ${products.length} sản phẩm`}
          </span>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:bg-white'}`}>{page}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* --- 5. SỬA PROPS TRUYỀN XUỐNG --- */}
      <ProductModal
        showModal={showModal}
        editingProduct={editingProduct}
        formData={formData}
        categories={categories}
        units={units}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        // Thay thế onImagesChange bằng 2 props mới:
        onThumbnailChange={handleThumbnailChange}
        onGalleryChange={handleGalleryChange}
      />

      <ProductDetailModal
        productId={detailProductId}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleEdit}
        onDelete={deleteProduct}
      />
    </div>
  );
}