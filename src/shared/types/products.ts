export interface Products {
  id?: number;
  name: string;
  description?: string;
  price: string | number;
  category: {
    id: number;
    name: string;
  };
  imageUrl?: string;
}
