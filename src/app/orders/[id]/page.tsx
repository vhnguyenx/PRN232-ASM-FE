'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderId = parseInt(params.id as string);
        const data = await orderService.getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, isAuthenticated, router]);

  if (!order) {
    return (
      <>
        {isLoading && (
          <LoadingSpinner fullScreen message="Loading order details..." />
        )}
        
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <Link href="/orders" className="text-blue-600 hover:underline">
              Back to Orders
            </Link>
          </div>
        </div>
      </>
    );
  }

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <LoadingSpinner fullScreen message="Loading order details..." />
      )}

      <div className="container mx-auto px-4 py-8">
      <Link href="/orders" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Orders
      </Link>
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Order Header */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        
        {/* Shipping Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Shipping Information</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="mb-2">
              <span className="font-medium">Address:</span> {order.shippingAddress}
            </p>
            <p className="mb-2">
              <span className="font-medium">Phone:</span> {order.phone}
            </p>
            {order.notes && (
              <p>
                <span className="font-medium">Notes:</span> {order.notes}
              </p>
            )}
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Payment Information</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 border-b pb-4">
                {item.productImage && (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${item.subtotal.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
