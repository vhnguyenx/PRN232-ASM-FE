'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCart } from '@/redux/cartSlice';
import { orderService } from '@/services/orderService';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingButton from '@/components/LoadingButton';

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cart, isLoading: cartLoading } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phone: '',
    notes: '',
    paymentMethod: 'COD',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const order = await orderService.createOrder(formData);
      
      if (formData.paymentMethod === 'COD') {
        router.push(`/payment/success?orderId=${order.id}`);
      } else {
        // TODO: Integrate PayOS here
        router.push(`/payment/success?orderId=${order.id}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <>
        {cartLoading && (
          <LoadingSpinner fullScreen message="Loading checkout..." />
        )}
        
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Loading Overlays */}
      {cartLoading && (
        <LoadingSpinner fullScreen message="Loading checkout..." />
      )}
      {isSubmitting && (
        <LoadingSpinner fullScreen message="Processing your order..." />
      )}

      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Shipping Address *
                </label>
                <textarea
                  name="shippingAddress"
                  required
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter your full address"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Any special instructions?"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="PayOS">PayOS (Online Payment)</option>
                </select>
              </div>
            </div>
            
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              loadingText="Processing..."
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-6"
            >
              Place Order
            </LoadingButton>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.productName} x {item.quantity}
                  </span>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
