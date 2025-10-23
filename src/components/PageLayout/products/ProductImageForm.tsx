// src/components/forms/ProductImageForm.tsx
import React, { useState, useCallback, useMemo } from 'react';

// Giả định: CloudinaryUploader component - GIỮ NGUYÊN
const CloudinaryUploader: React.FC<{ 
    initialImage: string | null; 
    onUploadComplete: (url: string) => void;
    label: string;
    className?: string;
    multiple?: boolean;
}> = ({ initialImage, onUploadComplete, label, className }) => {
    // Đây chỉ là một component giả để hiển thị giao diện và mô phỏng chức năng
    const [preview, setPreview] = useState(initialImage);

    // Mặc định, bạn có thể thay thế bằng logic gọi Cloudinary API hoặc S3/GCP
    const handleSimulatedUpload = () => {
        const fakeUrl = prompt("Nhập URL ảnh (hoặc giả lập upload):", initialImage || "https://res.cloudinary.com/.../new-image.jpg");
        if (fakeUrl) {
            setPreview(fakeUrl);
            onUploadComplete(fakeUrl);
        }
    };

    return (
        <div className={`border p-3 rounded-md shadow-sm ${className}`}>
            <p className="text-sm font-medium mb-2">{label}</p>
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md relative mb-2 overflow-hidden">
                {preview ? (
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                        onError={(e) => { e.currentTarget.src = '/placeholder-image.png'; }}
                    />
                ) : (
                    <span className="text-gray-500 text-sm">Chưa có ảnh</span>
                )}
                {preview && (
                    <button 
                        type="button" 
                        onClick={() => { setPreview(null); onUploadComplete(''); }} 
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <button 
                type="button" 
                onClick={handleSimulatedUpload} 
                className="w-full text-center py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
                {preview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
            </button>
        </div>
    );
};

interface ProductImageFormProps {
    currentImages: string[];
    onImagesChange: (urls: string[]) => void;
}

const ProductImageForm: React.FC<ProductImageFormProps> = ({ currentImages, onImagesChange }) => {
    // Quy ước: images[0] là Thumbnail, images[1]... là Gallery
    const thumbnail = useMemo(() => currentImages[0] || null, [currentImages]);
    const gallery = useMemo(() => currentImages.slice(1) || [], [currentImages]);
    
    // 1. Khai báo handleThumbnailChange (CHỈ 1 LẦN)
    const handleThumbnailChange = useCallback((url: string) => {
        // Áp dụng ép kiểu (as string[]) ngay tại đây
        const newImages = [url, ...gallery].filter(Boolean) as string[];
        onImagesChange(newImages);
    }, [gallery, onImagesChange]);

    // 2. Khai báo các hàm Gallery (Giữ nguyên)
    const handleAddGalleryImage = () => {
        const newUrl = prompt("Nhập URL ảnh phụ (hoặc giả lập upload):");
        if (newUrl) {
            const newGallery = [...gallery, newUrl];
            // Áp dụng ép kiểu (as string[])
            const newImages = [thumbnail, ...newGallery].filter(Boolean) as string[]; 
            onImagesChange(newImages);
        }
    };

    const handleRemoveGalleryImage = (indexToRemove: number) => {
        const newGallery = gallery.filter((_, index) => index !== indexToRemove);
        // Áp dụng ép kiểu (as string[])
        const newImages = [thumbnail, ...newGallery].filter(Boolean) as string[]; 
        onImagesChange(newImages);
    };

    // Hàm sắp xếp
    const handleMoveGalleryImage = (fromIndex: number, toIndex: number) => {
        const newGallery = Array.from(gallery);
        const [movedItem] = newGallery.splice(fromIndex, 1);
        newGallery.splice(toIndex, 0, movedItem);

        // Áp dụng ép kiểu (as string[])
        const newImages = [thumbnail, ...newGallery].filter(Boolean) as string[]; 
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Quản lý Hình ảnh</h3>

            {/* 1. Ảnh Chính */}
            <CloudinaryUploader
                label="Ảnh Chính (Thumbnail)"
                initialImage={thumbnail}
                onUploadComplete={handleThumbnailChange}
            />

            {/* 2. Ảnh Phụ (Gallery) */}
            <div>
                {/* ... (phần JSX cho Gallery - GIỮ NGUYÊN) ... */}
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-700">Bộ Sưu Tập Ảnh Phụ ({gallery.length})</h4>
                    <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Thêm ảnh
                    </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                    {gallery.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Chưa có ảnh phụ nào.</p>
                    ) : (
                        gallery.map((url, index) => (
                            <div key={index} className="flex items-center p-2 bg-white border rounded-md shadow-sm">
                                <div className="w-16 h-16 mr-3 overflow-hidden rounded border">
                                    <img 
                                        src={url} 
                                        alt={`Gallery ${index + 1}`} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => { e.currentTarget.src = '/placeholder-image.png'; }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 truncate flex-1">{url}</span>
                                
                                <div className="flex space-x-1 ml-3">
                                    {/* Nút di chuyển lên */}
                                    <button
                                        type="button"
                                        onClick={() => handleMoveGalleryImage(index, index - 1)}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
                                        title="Di chuyển lên"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    {/* Nút di chuyển xuống */}
                                    <button
                                        type="button"
                                        onClick={() => handleMoveGalleryImage(index, index + 1)}
                                        disabled={index === gallery.length - 1}
                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
                                        title="Di chuyển xuống"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {/* Nút xóa */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGalleryImage(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Xóa ảnh"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductImageForm;