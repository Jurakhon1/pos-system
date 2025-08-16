interface TopProduct {
    productId: number;
    name: string;
    totalQuantity: number;
    totalRevenue: number;
  }
  
  interface Details {
    orderCount: number;
    averageOrderValue: number;
    topProducts: TopProduct[];
  }
  
  export interface DailySales {
    id: number;
    date: string;
    totalSales: number;
    details: Details;
  }
  
