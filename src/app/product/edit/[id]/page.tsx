'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RootState, AppDispatch } from '../../../../redux/store';
import { fetchProductById, updateProduct, ProductUpdateData, ProductCreateData } from '../../../../redux/productsSlice';
import ProductForm from '../../../../components/ProductForm';

export default function EditProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  
  const { currentProduct, loading, uploading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  const handleSubmit = async (productData: ProductCreateData | ProductUpdateData) => {
    try {
      // Ensure we have the product ID for update
      const updateData: ProductUpdateData = {
        ...productData,
        id: productId
      };
      await dispatch(updateProduct(updateData));
      router.push(`/product/${productId}`);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (loading && !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/product/${productId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Product
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <ProductForm
          product={currentProduct}
          onSubmit={handleSubmit}
          loading={loading}
          uploading={uploading}
        />
      </div>
    </div>
  );
}