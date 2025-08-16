import api from "@/shared/api/axios";
import { Products } from "@/shared/types/products";

export const productsApi = {
  getProducts: async (): Promise<Products[]> => {
    const response = await api.get("/products");
    return response.data;
  },

  getProduct: async (id: number): Promise<Products> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (product: Partial<Products>): Promise<Products> => {
    const response = await api.post("/products", product);
    return response.data;
  },

  updateProduct: async (id: number, product: Partial<Products>): Promise<Products> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
