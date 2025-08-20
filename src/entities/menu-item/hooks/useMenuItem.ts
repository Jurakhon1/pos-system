import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuItemApi } from "../api/menuItemApi";
import { MenuItem } from "@/shared/types/menu";

export const useMenuItems = () => {
  const queryClient = useQueryClient();

  const {
    data: menuItems,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["menuItems"],
    queryFn: menuItemApi.getMenuItems,
  });

  const createMenuItemMutation = useMutation({
    mutationFn: (menuItemData: MenuItem) => menuItemApi.createMenuItem(menuItemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: ({ menuItemId, menuItemData }: { menuItemId: string; menuItemData: Partial<MenuItem> }) =>
      menuItemApi.updateMenuItem(menuItemId, menuItemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: (menuItemId: string) => menuItemApi.deleteMenuItem(menuItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (menuItemId: string) => menuItemApi.toggleActive(menuItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const toggleAvailableMutation = useMutation({
    mutationFn: (menuItemId: string) => menuItemApi.toggleAvailable(menuItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  return {
    menuItems,
    isLoading,
    error,
    refetch,
    createMenuItem: createMenuItemMutation.mutate,
    updateMenuItem: updateMenuItemMutation.mutate,
    deleteMenuItem: deleteMenuItemMutation.mutate,
    toggleActive: toggleActiveMutation.mutate,
    toggleAvailable: toggleAvailableMutation.mutate,
    isCreating: createMenuItemMutation.isPending,
    isUpdating: updateMenuItemMutation.isPending,
    isDeleting: deleteMenuItemMutation.isPending,
    isTogglingActive: toggleActiveMutation.isPending,
    isTogglingAvailable: toggleAvailableMutation.isPending,
  };
};

export const useMenuItem = (menuItemId: string) => {
  const queryClient = useQueryClient();

  const {
    data: menuItem,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["menuItem", menuItemId],
    queryFn: () => menuItemApi.getMenuItemById(menuItemId),
    enabled: !!menuItemId,
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: (menuItemData: Partial<MenuItem>) => menuItemApi.updateMenuItem(menuItemId, menuItemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItem", menuItemId] });
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: () => menuItemApi.deleteMenuItem(menuItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  return {
    menuItem,
    isLoading,
    error,
    refetch,
    updateMenuItem: updateMenuItemMutation.mutate,
    deleteMenuItem: deleteMenuItemMutation.mutate,
    isUpdating: updateMenuItemMutation.isPending,
    isDeleting: deleteMenuItemMutation.isPending,
  };
};
