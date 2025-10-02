'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchProductById } from '../../../redux/productsSlice';

export default function ProductDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  
  const { currentProduct, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Skeleton */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image Section with White Background and Proper Object Fit */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden">
              {currentProduct.image ? (
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-2">📷</div>
                  <div>No Image Available</div>
                </div>
              )}
            </div>
          </div>
          {/* Product Information Section */}
          <div className="bg-white space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              {currentProduct.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {currentProduct.category}
                </span>
              )}
            </div>
            
            <div className="text-4xl font-bold text-blue-600">
              ${currentProduct.price.toFixed(2)}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>
            
            {currentProduct.stock !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
                <p className="text-gray-600">
                  {currentProduct.stock > 0 ? (
                    <span className="text-green-600 font-medium flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {currentProduct.stock} items in stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Out of stock
                    </span>
                  )}
                </p>
              </div>
            )}
            
            <div className="flex space-x-4 pt-4">
              <Link
                href={`/product/edit/${currentProduct.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center space-x-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Product</span>
              </Link>
              
              <Link
                href="/"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to List</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}