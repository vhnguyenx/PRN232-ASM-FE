'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import { OrderItem } from '@/types';

function PayOSCancelContent() {
  const searchParams = useSearchParams();
  
  const paymentId = searchParams.get('id');
  const cancel = searchParams.get('cancel');
  const status = searchParams.get('status');
  const orderCode = searchParams.get('orderCode');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      // Verify this is a cancelled payment
      if (cancel !== 'true' || status !== 'CANCELLED') {
        setError('Invalid cancel request');
        setIsLoading(false);
        return;
      }

      if (!orderCode) {
        setError('Order code is missing');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch order details using orderCode
        const orderData = await orderService.getOrder(parseInt(orderCode));
        setOrder(orderData);
        
        // Update payment status to canceled
        await orderService.updatePaymentStatus(orderData.id, 'Canceled');
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [cancel, status, orderCode]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Processing cancellation..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Cancel Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
              <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
            <p className="text-gray-600 mb-4">
              Your payment has been cancelled. No charges were made.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-orange-50 border border-orange-200 rounded-md">
              <span className="text-sm text-orange-800">
                Payment ID: <span className="font-mono font-semibold">{paymentId}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold text-gray-900">#{order.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-gray-900">{orderCode}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-gray-900">
                ${order.totalAmount?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Payment Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Canceled
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: OrderItem, idx: number) => (
                <div key={idx} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-0">
                  {item.productImage && (
                    <Image
                      src={item.productImage}
                      alt={item.productName || 'Product'}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.productName || 'Product'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} × ${item.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${item.subtotal?.toFixed(2) || '0.00'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/cart"
            className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Back to Cart
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PayOSCancelPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
      <PayOSCancelContent />
    </Suspense>
  );
}
