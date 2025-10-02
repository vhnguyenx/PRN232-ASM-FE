'use client';

import React from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Product } from '../redux/productsSlice';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="h-48 bg-white-200 flex items-center justify-center">
  {product.image ? (
    <img
      src={product.image}
      alt={product.name}
      className="max-w-full max-h-full object-contain"
    />
  ) : (
    <div className="text-gray-400 text-sm">No Image</div>
  )}
</div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {product.name}
        </h3>
        
        <p className="text-2xl font-bold text-blue-600 mb-2">
          ${product.price.toFixed(2)}
        </p>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {product.stock !== undefined && (
          <p className="text-sm text-gray-500 mb-4">
            Stock: {product.stock}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <Link
            href={`/product/${product.id}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Link>
          
          <div className="flex space-x-2">
            <Link
              href={`/product/edit/${product.id}`}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-md transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Link>
            
            <button
              onClick={() => onDelete(product.id)}
              className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-md transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;