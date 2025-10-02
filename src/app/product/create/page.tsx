'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RootState, AppDispatch } from '../../../redux/store';
import { createProduct, ProductCreateData } from '../../../redux/productsSlice';
import ProductForm from '../../../components/ProductForm';

export default function CreateProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, uploading } = useSelector((state: RootState) => state.products);
  debugger;
  const handleSubmit = async (productData: ProductCreateData) => {
    try {
      console.log(productData);
      await dispatch(createProduct(productData));
      router.push('/');
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
        <p className="text-gray-600">Add a new product to your catalog</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <ProductForm
          onSubmit={handleSubmit}
          loading={loading}
          uploading={uploading}
        />
      </div>
    </div>
  );
}