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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const paymentData = await orderService.createPayOSPayment({
        shippingAddress: formData.shippingAddress,
        phone: formData.phone,
        notes: formData.notes,
        paymentMethod: 'PayOS',
      });
      
      // Store orderCode to orderId mapping in sessionStorage for later retrieval
      if (paymentData.orderCode) {
        sessionStorage.setItem(`orderCode_${paymentData.orderCode}`, 'pending');
      }
      
      // Redirect to PayOS checkout page
      if (paymentData.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
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
        <LoadingSpinner fullScreen message="Processing payment..." />
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        ${item.productPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipping Address *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    required
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter your address"
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
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Any special instructions?"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium text-blue-900">Payment Method</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    PayOS - Secure Online Payment
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    You will be redirected to PayOS payment gateway
                  </p>
                </div>
              </div>

              <LoadingButton
                type="submit"
                loading={isSubmitting}
                loadingText="Processing..."
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-6"
              >
                Proceed to Payment
              </LoadingButton>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

