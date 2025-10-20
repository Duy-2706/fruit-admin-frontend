'use client';
import React, { useState } from 'react';
import ProductHeader, { ProductTable } from '@/components/PageLayout/products/ProductHeader';
import ProductModal from '@/components/pages/ProductModal';
import { useProducts } from '@/hooks/useProduct';
import { Product, CreateProductRequest } from '@/types/product';

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
    itemsPerPage,
    xlsxLoaded,
    setSearchQuery,
    setCurrentPage,
    deleteProduct,
    createProduct,
    updateProduct,
    handleExportExcel,
    handleImportExcel
  } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
    images: []
  });

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
      images: []
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      category_id: parseInt(product.category_id),
      unit_id: parseInt(product.unit_id),
      price: parseFloat(product.price),
      stock_quantity: product.stock_quantity,
      short_description: product.short_description,
      description: product.description,
      origin: product.origin,
      is_active: product.is_active,
      is_featured: product.is_featured,
      images: product.images || [],
      compare_price: product.compare_price ? parseFloat(product.compare_price) : undefined,
      cost_price: product.cost_price ? parseFloat(product.cost_price) : undefined,
      weight: product.weight,
      is_fresh: product.is_fresh,
      shelf_life_days: product.shelf_life_days,
      storage_conditions: product.storage_conditions,
      harvest_season: product.harvest_season,
      organic_certified: product.organic_certified,
      specifications: product.specifications
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.category_id || !formData.unit_id) {
      alert('Vui lòng chọn danh mục và đơn vị');
      return;
    }

    const success = editingProduct
      ? await updateProduct(editingProduct.id, formData)
      : await createProduct(formData);

    if (success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleImagesChange = (urls: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      images: Array.isArray(urls) ? urls : [urls]
    }));
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="space-y-6">
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
        />

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600 font-medium">
            {searchQuery ? (
              <>Tìm thấy {filteredProducts.length} / {products.length} sản phẩm</>
            ) : (
              <>Tổng: {products.length} sản phẩm</>
            )}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
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

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
        onImagesChange={handleImagesChange}
      />
    </div>
  );
}