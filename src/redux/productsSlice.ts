import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../services/productService';
import { uploadImageToCloudinary } from '../services/cloudinary';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: string;
  stock?: number;
}

// Extended interface for product creation with optional image file
export interface ProductCreateData {
  name: string;
  price: number;
  description: string;
  category?: string;
  stock?: number;
  imageFile?: File; // For file upload
  image?: string;   // For existing image URL
}

// Extended interface for product update with optional image file
export interface ProductUpdateData extends ProductCreateData {
  id: number;
}

// Search and filter parameters
export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'created';
  sortOrder?: 'asc' | 'desc';
}

interface ProductsState {
  products: Product[];
  allProducts: Product[]; // Store all products for client-side filtering
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  uploading: boolean; // New state for tracking image upload
  
  // Search and filter state
  searchQuery: string;
  selectedCategory: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'name' | 'price' | 'created';
  sortOrder: 'asc' | 'desc';
  
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Available categories for filter
  categories: string[];
}

const initialState: ProductsState = {
  products: [],
  allProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  uploading: false,
  
  // Search and filter initial state
  searchQuery: '',
  selectedCategory: '',
  minPrice: null,
  maxPrice: null,
  sortBy: 'name',
  sortOrder: 'asc',
  
  // Pagination initial state
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 12,
  hasNextPage: false,
  hasPrevPage: false,
  
  categories: [],
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await productService.getAllProducts();
    return response;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    const response = await productService.getProductById(id);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: ProductCreateData, { rejectWithValue }) => {
    try {
      debugger
      let imageUrl = productData.image;
      console.log(imageUrl);
      // Upload image to Cloudinary if imageFile is provided
      if (productData.imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(productData.imageFile);
        } catch (error) {
          return rejectWithValue(
            error instanceof Error ? error.message : 'Image upload failed'
          );
        }
      }

      // Prepare product data for backend (exclude imageFile)
      const productPayload: Omit<Product, 'id'> = {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        image: imageUrl,
      };

      // Send product data to backend
      const response = await productService.createProduct(productPayload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData: ProductUpdateData, { rejectWithValue, getState }) => {
    try {
      let imageUrl = productData.image;

      // Upload new image to Cloudinary if imageFile is provided
      if (productData.imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(productData.imageFile);
        } catch (error) {
          return rejectWithValue(
            error instanceof Error ? error.message : 'Image upload failed'
          );
        }
      } else {
        // Keep existing image URL if no new file is provided
        const state = getState() as { products: ProductsState };
        const existingProduct = state.products.currentProduct;
        if (existingProduct && existingProduct.id === productData.id && !imageUrl) {
          imageUrl = existingProduct.image;
        }
      }

      // Prepare product data for backend (exclude imageFile)
      const productPayload: Product = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        description: productData.description,
        category: productData.category,
        stock: productData.stock,
        image: imageUrl,
      };

      // Send updated product data to backend
      const response = await productService.updateProduct(productData.id, productPayload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number) => {
    await productService.deleteProduct(id);
    return id;
  }
);

// Client-side filtering function
const filterProducts = (
  products: Product[],
  searchQuery: string,
  selectedCategory: string,
  minPrice: number | null,
  maxPrice: number | null
): Product[] => {
  return products.filter(product => {
    // Search filter
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = !selectedCategory || 
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    // Price range filter
    const matchesMinPrice = minPrice === null || product.price >= minPrice;
    const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
};

// Client-side sorting function
const sortProducts = (
  products: Product[],
  sortBy: 'name' | 'price' | 'created',
  sortOrder: 'asc' | 'desc'
): Product[] => {
  return [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'created':
        comparison = a.id - b.id; // Assuming higher ID means newer
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Client-side pagination function
const paginateProducts = (
  products: Product[],
  currentPage: number,
  itemsPerPage: number
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return {
    products: paginatedProducts,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
    
    // Search and filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
      
      // Apply filters and update displayed products
      const filtered = filterProducts(
        state.allProducts,
        action.payload,
        state.selectedCategory,
        state.minPrice,
        state.maxPrice
      );
      
      const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
      
      const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
      
      state.products = paginated.products;
      state.totalItems = paginated.totalItems;
      state.totalPages = paginated.totalPages;
      state.hasNextPage = paginated.hasNextPage;
      state.hasPrevPage = paginated.hasPrevPage;
    },
    
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
      
      const filtered = filterProducts(
        state.allProducts,
        state.searchQuery,
        action.payload,
        state.minPrice,
        state.maxPrice
      );
      
      const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
      
      const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
      
      state.products = paginated.products;
      state.totalItems = paginated.totalItems;
      state.totalPages = paginated.totalPages;
      state.hasNextPage = paginated.hasNextPage;
      state.hasPrevPage = paginated.hasPrevPage;
    },
    
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.currentPage = 1;
      
      const filtered = filterProducts(
        state.allProducts,
        state.searchQuery,
        state.selectedCategory,
        action.payload.min,
        action.payload.max
      );
      
      const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
      
      const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
      
      state.products = paginated.products;
      state.totalItems = paginated.totalItems;
      state.totalPages = paginated.totalPages;
      state.hasNextPage = paginated.hasNextPage;
      state.hasPrevPage = paginated.hasPrevPage;
    },
    
    setSorting: (state, action: PayloadAction<{ sortBy: 'name' | 'price' | 'created'; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      
      const filtered = filterProducts(
        state.allProducts,
        state.searchQuery,
        state.selectedCategory,
        state.minPrice,
        state.maxPrice
      );
      
      const sorted = sortProducts(filtered, action.payload.sortBy, action.payload.sortOrder);
      
      const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
      
      state.products = paginated.products;
    },
    
    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      
      const filtered = filterProducts(
        state.allProducts,
        state.searchQuery,
        state.selectedCategory,
        state.minPrice,
        state.maxPrice
      );
      
      const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
      
      const paginated = paginateProducts(sorted, action.payload, state.itemsPerPage);
      
      state.products = paginated.products;
      state.hasNextPage = paginated.hasNextPage;
      state.hasPrevPage = paginated.hasPrevPage;
    },
    
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
      
      const filtered = filterProducts(
        state.allProducts,
        state.searchQuery,
        state.selectedCategory,
        state.minPrice,
        state.maxPrice
      );
      
      const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
      
      const paginated = paginateProducts(sorted, state.currentPage, action.payload);
      
      state.products = paginated.products;
      state.totalPages = paginated.totalPages;
      state.hasNextPage = paginated.hasNextPage;
      state.hasPrevPage = paginated.hasPrevPage;
    },
    
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.minPrice = null;
      state.maxPrice = null;
      state.currentPage = 1;
      
      const sorted = sortProducts(state.allProducts, state.sortBy, state.sortOrder);
      const paginated = paginateProducts(sorted, 1, state.itemsPerPage);
      
      state.products = paginated.products;
      state.totalItems = paginated.totalItems;
      state.totalPages = paginated.totalPages;
      state.hasNextPage = paginated.hasNextPage;
      state.hasPrevPage = paginated.hasPrevPage;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload;
        
        // Extract unique categories
        const categories = [...new Set(action.payload
          .map(product => product.category)
          .filter(Boolean) as string[])];
        state.categories = categories;
        
        // Apply current filters
        const filtered = filterProducts(
          action.payload,
          state.searchQuery,
          state.selectedCategory,
          state.minPrice,
          state.maxPrice
        );
        
        const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
        
        const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
        
        state.products = paginated.products;
        state.totalItems = paginated.totalItems;
        state.totalPages = paginated.totalPages;
        state.hasNextPage = paginated.hasNextPage;
        state.hasPrevPage = paginated.hasPrevPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.uploading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.uploading = false;
        state.allProducts.push(action.payload);
        
        // Update categories if new category added
        if (action.payload.category && !state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
        
        // Re-apply filters
        const filtered = filterProducts(
          state.allProducts,
          state.searchQuery,
          state.selectedCategory,
          state.minPrice,
          state.maxPrice
        );
        
        const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
        
        const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
        
        state.products = paginated.products;
        state.totalItems = paginated.totalItems;
        state.totalPages = paginated.totalPages;
        state.hasNextPage = paginated.hasNextPage;
        state.hasPrevPage = paginated.hasPrevPage;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.uploading = false;
        state.error = action.payload as string || 'Failed to create product';
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.uploading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.uploading = false;
        const index = state.allProducts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.allProducts[index] = action.payload;
        }
        state.currentProduct = action.payload;
        
        // Update categories if new category added
        if (action.payload.category && !state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
        
        // Re-apply filters
        const filtered = filterProducts(
          state.allProducts,
          state.searchQuery,
          state.selectedCategory,
          state.minPrice,
          state.maxPrice
        );
        
        const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
        
        const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
        
        state.products = paginated.products;
        state.totalItems = paginated.totalItems;
        state.totalPages = paginated.totalPages;
        state.hasNextPage = paginated.hasNextPage;
        state.hasPrevPage = paginated.hasPrevPage;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.uploading = false;
        state.error = action.payload as string || 'Failed to update product';
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = state.allProducts.filter(p => p.id !== action.payload);
        
        // Re-apply filters
        const filtered = filterProducts(
          state.allProducts,
          state.searchQuery,
          state.selectedCategory,
          state.minPrice,
          state.maxPrice
        );
        
        const sorted = sortProducts(filtered, state.sortBy, state.sortOrder);
        
        const paginated = paginateProducts(sorted, state.currentPage, state.itemsPerPage);
        
        state.products = paginated.products;
        state.totalItems = paginated.totalItems;
        state.totalPages = paginated.totalPages;
        state.hasNextPage = paginated.hasNextPage;
        state.hasPrevPage = paginated.hasPrevPage;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { 
  clearCurrentProduct, 
  clearError, 
  setUploading,
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  setSorting,
  setCurrentPage,
  setItemsPerPage,
  clearFilters
} = productsSlice.actions;
export default productsSlice.reducer;