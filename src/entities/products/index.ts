export { ProductsApi } from './api/productsApi';
export type { Product, CreateProductDto, UpdateProductDto } from './api/productsApi';
export { 
  useProducts, 
  useProduct, 
  useProductsByCategory, 
  useProductsSearch,
  useLowStockProducts,
  useOutOfStockProducts
} from './hooks/useProducts';
