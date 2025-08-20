import api from "@/shared/api/axios";

export interface KitchenStation {
  id: string;
  location_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  menuItems?: MenuItemStation[];
}

export interface MenuItemStation {
  id: string;
  menu_item_id: string;
  kitchen_station_id: string;
  menuItem?: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
}

export interface CreateKitchenStationDto {
  location_id: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateKitchenStationDto {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface KitchenDashboard {
  stations: KitchenStation[];
  activeOrders: any[];
  pendingOrders: any[];
}

export const kitchenApi = {
  // Get kitchen dashboard
  getDashboard: async (): Promise<KitchenDashboard> => {
    const response = await api.get('/kitchen/dashboard');
    return response.data;
  },

  // Get all kitchen stations
  getStations: async (): Promise<KitchenStation[]> => {
    const response = await api.get('/kitchen/stations');
    return response.data;
  },

  // Create new kitchen station
  createStation: async (data: CreateKitchenStationDto): Promise<KitchenStation> => {
    const response = await api.post('/kitchen/stations', data);
    return response.data;
  },

  // Update kitchen station
  updateStation: async (id: string, data: UpdateKitchenStationDto): Promise<KitchenStation> => {
    const response = await api.patch(`/kitchen/stations/${id}`, data);
    return response.data;
  },

  // Delete kitchen station
  deleteStation: async (id: string): Promise<void> => {
    await api.delete(`/kitchen/stations/${id}`);
  },

  // Assign menu item to station
  assignMenuItemToStation: async (stationId: string, menuItemId: string): Promise<void> => {
    await api.post(`/kitchen/stations/${stationId}/assign-menu-item`, {
      menuItemId
    });
  },

  // Get orders for specific station
  getOrdersForStation: async (stationId: string): Promise<any[]> => {
    const response = await api.get(`/kitchen/stations/${stationId}/orders`);
    return response.data;
  },

  // Start cooking order item
  startCooking: async (orderItemId: string): Promise<void> => {
    await api.post(`/kitchen/orders/${orderItemId}/start-cooking`);
  },

  // Mark order item as ready
  markAsReady: async (orderItemId: string): Promise<void> => {
    await api.post(`/kitchen/orders/${orderItemId}/mark-ready`);
  }
};
