'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { OrderItem } from '@/types';
import Link from 'next/link';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

function PayOSSuccessContent() {
  const searchParams = useSearchParams();
  // const router = useRouter(); // Removed unused variable
  
  const code = searchParams.get('code');
  const paymentId = searchParams.get('id');
  const cancel = searchParams.get('cancel');
  const status = searchParams.get('status');
  const orderCode = searchParams.get('orderCode');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      // Check if payment was successful
      if (code !== '00' || cancel === 'true' || status !== 'PAID') {
        setError('Payment was not completed successfully');
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
        
        // Update payment status to paid
        await orderService.updatePaymentStatus(orderData.id, 'Paid');
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [code, cancel, status, orderCode]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Verifying payment..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">{error || 'Something went wrong'}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. We&apos;ll send you a confirmation email shortly.
          </p>
          
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-sm break-all">{paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Paid</span>
              </div>
            </div>
          </div>
          
          {/* Order Items Section */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.productImage && (
                        <Image
                          src={item.productImage}
                          alt={item.productName || 'Product'}
                          width={56}
                          height={56}
                          className="w-14 h-14 object-cover rounded-md border"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${item.subtotal?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href={`/orders/${order.id}`}
              className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              View Order Details
            </Link>
            <Link
              href="/orders"
              className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
            >
              View All Orders
            </Link>
            <Link
              href="/"
              className="block w-full text-blue-600 py-3 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayOSSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
      <PayOSSuccessContent />
    </Suspense>
  );
}
