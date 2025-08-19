import api from "@/shared/api/axios";

 export interface Table {
  id: string;
  location_id:string
  number: number;
  capacity: number;
  is_active:boolean
  zone:string
  created_at:string
  updated_at:string
  location:any
}

interface CreateTableDto {
  number: number;
  capacity: number;
}


interface UpdateTableDto {
  number?: number;
  capacity?: number;
  status?: 'free' | 'occupied' | 'reserved';
}

export const tableApi = {
  // Получить все столы
  async getTables() {
    const { data } = await api.get<Table[]>('/tables');
    return data;
  },

  // Получить стол по ID
  async getTableById(id: string) {
    const { data } = await api.get<Table>(`/tables/${id}`);
    return data;
  },

  // Создать новый стол
  async createTable(dto: CreateTableDto) {
    const { data } = await api.post<Table>('/tables', dto);
    return data;
  },

  // Обновить стол
  async updateTable(id: string, dto: UpdateTableDto) {
    const { data } = await api.patch<Table>(`/tables/${id}`, dto);
    return data;
  },

  // Удалить стол
  async deleteTable(id: string) {
    await api.delete(`/tables/${id}`);
  },

  // Изменить статус стола
  async updateTableStatus(id: string, status: Table['is_active']) {
    const { data } = await api.patch<Table>(`/tables/${id}/status`, { status });
    return data;
  }
};
