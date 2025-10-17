'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCart, updateCartItem, removeFromCart } from '@/redux/cartSlice';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingButton from '@/components/LoadingButton';

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cart, isLoading } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [updatingItemId, setUpdatingItemId] = React.useState<number | null>(null);
  const [removingItemId, setRemovingItemId] = React.useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Fetch cart from backend when component mounts
    console.log('🛒 Fetching cart from backend...');
    dispatch(fetchCart())
      .unwrap()
      .then(() => console.log('✅ Cart loaded successfully'))
      .catch((error) => console.error('❌ Failed to load cart:', error));
  }, [dispatch, isAuthenticated, router]);

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      alert('Quantity cannot be less than 1');
      return;
    }
    
    setUpdatingItemId(id);
    try {
      console.log('🔄 Updating cart item:', id, 'to quantity:', newQuantity);
      await dispatch(updateCartItem({ id, data: { quantity: newQuantity } })).unwrap();
      console.log('✅ Cart item updated');
    } catch (error) {
      console.error('❌ Failed to update cart item:', error);
      alert(`Failed to update quantity: ${error}`);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (id: number, productName: string) => {
    if (!confirm(`Remove "${productName}" from cart?`)) {
      return;
    }
    
    setRemovingItemId(id);
    try {
      console.log('🗑️ Removing cart item:', id);
      await dispatch(removeFromCart(id)).unwrap();
      console.log('✅ Cart item removed');
    } catch (error) {
      console.error('❌ Failed to remove cart item:', error);
      alert(`Failed to remove item: ${error}`);
    } finally {
      setRemovingItemId(null);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <>
        {isLoading && (
          <LoadingSpinner fullScreen message="Loading your cart..." />
        )}
        
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Loading Overlays */}
      {isLoading && (
        <LoadingSpinner fullScreen message="Loading your cart..." />
      )}
      {updatingItemId && (
        <LoadingSpinner fullScreen message="Updating cart..." />
      )}
      {removingItemId && (
        <LoadingSpinner fullScreen message="Removing item..." />
      )}

      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const isUpdating = updatingItemId === item.id;
            
            return (
              <div
                key={item.id}
                className={`flex gap-4 bg-white p-6 rounded-lg shadow-md transition-all ${
                  isUpdating ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xl text-gray-900 mb-2 truncate">
                    {item.productName}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <p className="text-lg font-medium text-blue-600">
                      ${item.productPrice.toFixed(2)} <span className="text-sm text-gray-500">each</span>
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={item.quantity <= 1 || isUpdating}
                        title="Decrease quantity"
                      >
                        −
                      </button>
                      
                      <span className="w-16 px-2 py-2 text-center border-x-2 border-gray-300 font-semibold text-gray-900 flex items-center justify-center">
                        {isUpdating ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={isUpdating}
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    
                    <LoadingButton
                      onClick={() => handleRemove(item.id, item.productName)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                      loading={removingItemId === item.id}
                    >
                      Remove
                    </LoadingButton>
                  </div>
                </div>
                
                {/* Subtotal */}
                <div className="flex flex-col items-end justify-between">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                    <p className="font-bold text-2xl text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                  
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-500">
                      ${item.productPrice.toFixed(2)} × {item.quantity}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
            
            {/* Items Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})</span>
                <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              
              <div className="border-t-2 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${cart.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Count Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Items in cart:</p>
              {cart.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 truncate mr-2">{item.productName}</span>
                  <span className="text-gray-900 font-medium">×{item.quantity}</span>
                </div>
              ))}
              {cart.items.length > 3 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{cart.items.length - 3} more {cart.items.length - 3 === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
            
            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors block text-center font-semibold text-lg shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              href="/"
              className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors block text-center font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
