import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Products, CreateProductDto, UpdateProductDto } from '../model/types';
import { api } from '@/shared/api/axios';

const PRODUCTS_ENDPOINT = '/products';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Products[]> => {
      const { data } = await api.get(PRODUCTS_ENDPOINT);
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async (): Promise<Products> => {
      const { data } = await api.get(`${PRODUCTS_ENDPOINT}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: CreateProductDto): Promise<Products> => {
      const { data } = await api.post(PRODUCTS_ENDPOINT, product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, product }: { id: string; product: UpdateProductDto }): Promise<Products> => {
      const { data } = await api.put(`${PRODUCTS_ENDPOINT}/${id}`, product);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`${PRODUCTS_ENDPOINT}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
