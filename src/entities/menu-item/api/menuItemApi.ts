import api from "@/shared/api/axios";
import { MenuItem } from "@/shared/types/menu-items";

export const menuItemApi = {
  getMenuItems: async () => {
    const response = await api.get(`/menu/items`);
    return response.data;
  },

  getMenuItemById: async (menuItemId: string) => {
    const response = await api.get(`/menu/items/${menuItemId}`);
    return response.data;
  },

  createMenuItem: async (menuItemData: MenuItem) => {
    const response = await api.post(`/menu/items`, menuItemData);
    return response.data;
  },

  updateMenuItem: async (menuItemId: string, menuItemData: Partial<MenuItem>) => {
    const response = await api.put(`/menu/items/${menuItemId}`, menuItemData);
    return response.data;
  },

  deleteMenuItem: async (menuItemId: string) => {
    const response = await api.delete(`/menu/items/${menuItemId}`);
    return response.data;
  }
};

