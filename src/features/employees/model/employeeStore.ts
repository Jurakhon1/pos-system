import { create } from 'zustand';

interface EmployeeState {
  activeTab: 'waiters' | 'couriers';
  searchQuery: string;
  dateRange: { start: string; end: string };
  setActiveTab: (tab: 'waiters' | 'couriers') => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (start: string, end: string) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  activeTab: 'waiters',
  searchQuery: '',
  dateRange: { start: '1-7-2025', end: '31-7-2025' },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDateRange: (start, end) => set({ dateRange: { start, end } }),
}));