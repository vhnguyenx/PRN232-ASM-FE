'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Product, ProductCreateData, ProductUpdateData } from '../redux/productsSlice';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: ProductCreateData | ProductUpdateData) => void;
  loading: boolean;
  uploading?: boolean;
}

interface FormData {
  name: string;
  price: string;
  description: string;
  image: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  description?: string;
  image?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, loading, uploading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    description: '',
    image: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        image: product.image || '',
      });
      setImagePreview(product.image || '');
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setErrors(prev => ({ ...prev, image: 'Image file size must be less than 5MB' }));
        return;
      }
      
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, image: undefined }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔥 ProductForm handleSubmit called');
  console.log('🔥 Current formData:', formData);
  console.log('🔥 Selected file state:', selectedFile); // 

    if (!validateForm()) {
      return;
    }

    const productData: ProductCreateData | ProductUpdateData = {
      ...(product ? { id: product.id } : {}),
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      imageFile: selectedFile || undefined,
      image: !selectedFile ? formData.image.trim() || undefined : undefined,
    };

  console.log('🚀 ProductForm sending productData:', productData);
  console.log('📁 imageFile in productData:', productData.imageFile);

    onSubmit(productData as ProductCreateData | ProductUpdateData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter product name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          className={`w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
            errors.price ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter price"
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter product description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image
        </label>
        
        <div className="space-y-4">
          {/* File Upload Section */}
          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-500 mb-2">
              Upload New Image
            </label>
            <input
              type="file"
              id="imageFile"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <Image
                src={imagePreview}
                alt="Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Or Image URL Section */}
          <div className="border-t pt-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-500 mb-2">
              Or Enter Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              disabled={!!selectedFile}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                selectedFile ? 'bg-gray-100' : 'bg-white'
              }`}
              placeholder="Enter image URL"
            />
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                File upload is selected. Clear the file to use URL instead.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading 
            ? 'Uploading Image...' 
            : loading 
            ? 'Saving...' 
            : product 
            ? 'Update Product' 
            : 'Create Product'
          }
        </button>
      </div>
    </form>
  );
};

export default ProductForm;