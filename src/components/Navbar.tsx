'use client';

import Link from 'next/link';
import { Package, Plus } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Product App</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/product/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Product</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;