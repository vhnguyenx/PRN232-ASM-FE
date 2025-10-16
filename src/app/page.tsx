'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProducts, deleteProduct } from '../redux/productsSlice';
import ProductList from '../components/ProductList';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    products, 
    loading, 
    totalItems,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice 
  } = useSelector((state: RootState) => state.products);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts()).finally(() => setInitialLoading(false));
  }, [dispatch]);

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      setDeleting(true);
      try {
        await dispatch(deleteProduct(productToDelete));
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Failed to delete product:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const getActiveFiltersText = () => {
    const filters = [];
    if (searchQuery) filters.push(`"${searchQuery}"`);
    if (selectedCategory) filters.push(selectedCategory);
    if (minPrice !== null || maxPrice !== null) {
      const priceRange = `$${minPrice || 0} - $${maxPrice || '∞'}`;
      filters.push(priceRange);
    }
    return filters.length > 0 ? ` for ${filters.join(', ')}` : '';
  };

  return (
    <>
      {/* Loading Overlay for initial load */}
      {initialLoading && (
        <LoadingSpinner fullScreen message="Loading products..." />
      )}

      {/* Loading Overlay for delete action */}
      {deleting && (
        <LoadingSpinner fullScreen message="Deleting product..." />
      )}

      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">
          {totalItems > 0 ? (
            <>Found {totalItems} product{totalItems !== 1 ? 's' : ''}{getActiveFiltersText()}</>
          ) : (
            'Manage your product catalog'
          )}
        </p>
      </div>

      <SearchAndFilter />

      <ProductList
        products={products}
        loading={loading}
        onDelete={handleDeleteClick}
      />

      <Pagination />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleting}
      />
      </div>
    </>
  );
}
