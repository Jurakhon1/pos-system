import api from "@/shared/api/axios";
import { Products } from "@/shared/types/products";

export const ProductsApi={
    getProducts: async()=>{
        const response = await api.get(`/products`);
        return response.data;
    },
    getProductById: async (productId: number) => {
        const response = await api.get(`/products/${productId}`);
        return response.data;
    },
    createProduct: async (productData: Products) => {
        const response = await api.post(`/products`, productData);
        return response.data;
    },
    updateProduct: async (productId: number, productData: Products) => {
        const response = await api.put(`/products/${productId}`, productData);
        return response.data;   
    },

}