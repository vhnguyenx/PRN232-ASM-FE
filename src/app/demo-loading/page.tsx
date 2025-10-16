'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingButton from '@/components/LoadingButton';

/**
 * Demo component để test các loading states
 * Truy cập tại: /demo-loading
 * 
 * Component này demo:
 * - LoadingSpinner với các sizes và modes khác nhau
 * - LoadingButton với các states khác nhau
 * - Simulated API calls
 */
export default function LoadingDemo() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [button1Loading, setButton1Loading] = useState(false);
  const [button2Loading, setButton2Loading] = useState(false);
  const [button3Loading, setButton3Loading] = useState(false);

  const simulateApiCall = (duration: number) => {
    return new Promise(resolve => setTimeout(resolve, duration));
  };

  const handleButton1 = async () => {
    setButton1Loading(true);
    await simulateApiCall(2000);
    setButton1Loading(false);
  };

  const handleButton2 = async () => {
    setButton2Loading(true);
    await simulateApiCall(3000);
    setButton2Loading(false);
  };

  const handleButton3 = async () => {
    setButton3Loading(true);
    await simulateApiCall(1500);
    setButton3Loading(false);
  };

  const handleFullScreenDemo = async () => {
    setShowFullScreen(true);
    await simulateApiCall(3000);
    setShowFullScreen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-2">Loading States Demo</h1>
      <p className="text-gray-600 mb-8">
        Demo các loading states được sử dụng trong ứng dụng
      </p>

      {/* Full Screen Loading Demo */}
      {showFullScreen && <LoadingSpinner fullScreen message="Loading full screen demo..." />}

      {/* Inline Spinners */}
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">LoadingSpinner Component</h2>
        
        <div className="space-y-6">
          {/* Small Spinner */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Small Spinner</h3>
            <div className="border border-gray-200 rounded p-4 bg-gray-50">
              <LoadingSpinner size="sm" />
            </div>
          </div>

          {/* Medium Spinner */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Medium Spinner (Default)</h3>
            <div className="border border-gray-200 rounded p-4 bg-gray-50">
              <LoadingSpinner size="md" />
            </div>
          </div>

          {/* Large Spinner */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Large Spinner</h3>
            <div className="border border-gray-200 rounded p-4 bg-gray-50">
              <LoadingSpinner size="lg" />
            </div>
          </div>

          {/* With Message */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Spinner with Message</h3>
            <div className="border border-gray-200 rounded p-4 bg-gray-50">
              <LoadingSpinner size="md" message="Loading your data..." />
            </div>
          </div>

          {/* Full Screen Button */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Full Screen Mode</h3>
            <button
              onClick={handleFullScreenDemo}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Show Full Screen Loading (3s)
            </button>
          </div>
        </div>
      </section>

      {/* Loading Buttons */}
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">LoadingButton Component</h2>
        
        <div className="space-y-6">
          {/* Primary Button */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Primary Button</h3>
            <LoadingButton
              loading={button1Loading}
              loadingText="Processing..."
              onClick={handleButton1}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Click to Load (2s)
            </LoadingButton>
          </div>

          {/* Success Button */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Success Button</h3>
            <LoadingButton
              loading={button2Loading}
              loadingText="Saving..."
              onClick={handleButton2}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Data (3s)
            </LoadingButton>
          </div>

          {/* Danger Button */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Danger Button</h3>
            <LoadingButton
              loading={button3Loading}
              loadingText="Deleting..."
              onClick={handleButton3}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Item (1.5s)
            </LoadingButton>
          </div>

          {/* Multiple Buttons */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Multiple Buttons</h3>
            <div className="flex gap-3">
              <LoadingButton
                loading={button1Loading}
                onClick={handleButton1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Button 1
              </LoadingButton>
              <LoadingButton
                loading={button2Loading}
                onClick={handleButton2}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Button 2
              </LoadingButton>
              <LoadingButton
                loading={button3Loading}
                onClick={handleButton3}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Button 3
              </LoadingButton>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Click multiple buttons to see independent loading states
            </p>
          </div>
        </div>
      </section>

      {/* Form Example */}
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Form Example</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); handleButton1(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              disabled={button1Loading}
              className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              disabled={button1Loading}
              className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={button1Loading}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={button1Loading}
              loadingText="Submitting..."
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Form
            </LoadingButton>
          </div>
        </form>
      </section>

      {/* Code Examples */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">LoadingSpinner Usage</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`import LoadingSpinner from '@/components/LoadingSpinner';

// Full screen
<LoadingSpinner fullScreen message="Loading..." />

// Inline
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" message="Loading data..." />
<LoadingSpinner size="lg" />`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">LoadingButton Usage</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`import LoadingButton from '@/components/LoadingButton';

const [isLoading, setIsLoading] = useState(false);

const handleClick = async () => {
  setIsLoading(true);
  try {
    await apiCall();
  } finally {
    setIsLoading(false);
  }
};

<LoadingButton
  loading={isLoading}
  loadingText="Processing..."
  onClick={handleClick}
  className="your-classes"
>
  Click Me
</LoadingButton>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
