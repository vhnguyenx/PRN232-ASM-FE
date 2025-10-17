'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Trash2, Eye, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../redux/productsSlice';
import { addToCart } from '../redux/cartSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useToast } from './ToastProvider';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useToast();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showError('Please login to add items to cart');
      return;
    }
    
    if (product.stock === 0 || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      
      // Show success state
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      
      showSuccess(`${product.name} added to cart!`);
      console.log('✅ Added to cart:', product.name);
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      showError(`Failed to add to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="h-48 bg-white-200 flex items-center justify-center">
  {product.image ? (
    <Image
      src={product.image}
      alt={product.name}
      width={200}
      height={200}
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
        
        {/* Stock Status - Only show if out of stock */}
        {product.stock !== undefined && product.stock === 0 && (
          <p className="text-sm mb-4 text-red-600 font-semibold">
            Out of Stock
          </p>
        )}
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart || addedToCart}
          className={`w-full mb-4 py-2 px-4 rounded-md font-medium flex items-center justify-center space-x-2 transition-all ${
            addedToCart
              ? 'bg-green-600 text-white cursor-default'
              : product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAddingToCart
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {addedToCart ? (
            <>
              <Check className="h-5 w-5" />
              <span>Added to Cart</span>
            </>
          ) : isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </>
          )}
        </button>
        
        <div className="flex justify-between items-center">
          <Link
            href={`/product/${product.id}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Link>
          
          {/* Only show edit/delete buttons when authenticated */}
          {isAuthenticated && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;