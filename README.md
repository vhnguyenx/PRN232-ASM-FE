# Product Management E-commerce App

A modern e-commerce CRUD web application built with **Next.js 14**, **TypeScript**, **Redux Toolkit**, and **TailwindCSS**.

## Features

- 🛍️ Complete product CRUD operations (Create, Read, Update, Delete)
- 🎨 Modern, responsive UI with TailwindCSS
- 🔄 State management with Redux Toolkit
- 📱 Mobile-responsive design
- ✅ Form validation with error handling
- 🔔 Confirmation dialogs for delete operations
- 🎯 Professional e-commerce design

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, React 19
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Backend API**: ASP.NET Core (http://localhost:7069/api/Product)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Redux Provider
│   ├── page.tsx           # Home page (product list)
│   ├── globals.css        # Global styles with TailwindCSS
│   └── product/
│       ├── [id]/
│       │   └── page.tsx   # Product detail page
│       ├── create/
│       │   └── page.tsx   # Create product page
│       └── edit/
│           └── [id]/
│               └── page.tsx # Edit product page
├── components/             # Reusable UI components
│   ├── Navbar.tsx         # Navigation component
│   ├── ProductCard.tsx    # Product card component
│   ├── ProductList.tsx    # Product list component
│   ├── ProductForm.tsx    # Product form component
│   └── ConfirmDialog.tsx  # Confirmation dialog component
├── redux/                  # Redux store and slices
│   ├── store.ts           # Redux store configuration
│   └── productsSlice.ts   # Products slice with async thunks
└── services/               # API services
    ├── axiosClient.ts     # Axios configuration
    └── productService.ts  # Product API service
```

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
2. **npm** or **yarn** package manager
3. **Backend API** running on `http://localhost:7069/api/Product`

## Installation & Setup

### 1. Install Node.js (if not already installed)

Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd product-fe
npm install
```

This will install all required packages:
- @reduxjs/toolkit
- axios
- lucide-react
- tailwindcss
- autoprefixer
- postcss
- And other dependencies...

### 3. Initialize TailwindCSS (if needed)

```bash
npx tailwindcss init -p
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## API Endpoints

The application expects the following API endpoints to be available at `http://localhost:7069/api/Product`:

- `GET /api/Product` - Get all products
- `GET /api/Product/{id}` - Get product by ID
- `POST /api/Product` - Create new product
- `PUT /api/Product/{id}` - Update product
- `DELETE /api/Product/{id}` - Delete product

### Product Model

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: string;
  stock?: number;
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pages & Features

### Home Page (`/`)
- Displays all products in a responsive grid layout
- Search and filter functionality
- Delete products with confirmation dialog

### Product Detail (`/product/[id]`)
- View complete product information
- Edit product button
- Back navigation

### Create Product (`/product/create`)
- Form to create new products
- Client-side validation
- Error handling

### Edit Product (`/product/edit/[id]`)
- Form to update existing products
- Pre-populated with current data
- Validation and error handling

## Components

### Navbar
- Fixed navigation with logo and menu
- Responsive design
- Navigation links (Home, Create Product)

### ProductCard
- Displays product information in card format
- Action buttons (View, Edit, Delete)
- Hover effects and responsive design

### ProductList
- Grid layout for products
- Loading states
- Empty state handling

### ProductForm
- Reusable form for create/edit operations
- Validation with error messages
- Required field indicators

### ConfirmDialog
- Modal dialog for delete confirmations
- Loading states
- Cancel/confirm actions

## Styling

The application uses **TailwindCSS** for styling with:
- Responsive design (mobile-first)
- Modern color palette
- Smooth transitions and hover effects
- Professional e-commerce appearance
- Loading states and animations

## State Management

**Redux Toolkit** manages application state with:

### Products Slice
- `fetchProducts` - Load all products
- `fetchProductById` - Load single product
- `createProduct` - Create new product
- `updateProduct` - Update existing product
- `deleteProduct` - Delete product

### State Structure
```typescript
interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}
```

## Troubleshooting

### Common Issues

1. **Dependencies not installing**
   - Make sure Node.js is installed
   - Try deleting `node_modules` and `package-lock.json`, then run `npm install`

2. **API connection errors**
   - Ensure backend API is running on `http://localhost:7069`
   - Check CORS settings on the backend

3. **TailwindCSS not working**
   - Verify `tailwind.config.js` and `postcss.config.js` are configured correctly
   - Check that TailwindCSS directives are in `globals.css`

4. **Build errors**
   - Run `npm run lint` to check for code issues
   - Ensure all imports are correct

## Future Enhancements

- [ ] Add product search and filtering
- [ ] Implement pagination
- [ ] Add image upload functionality
- [ ] User authentication
- [ ] Shopping cart functionality
- [ ] Order management
- [ ] Product categories management
- [ ] Inventory tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for educational purposes as part of an assignment.
