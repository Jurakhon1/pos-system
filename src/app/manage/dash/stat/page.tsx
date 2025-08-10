"use client";

import { SalesHeader } from "@/widgets/sales/sales-header";
import { SalesToday } from "@/widgets/sales/sales-today";
import { SalesMainChart } from "@/widgets/sales/sales-main-chart";
import { SalesMainKpis } from "@/widgets/sales/sales-main-kpis";
import { SalesChart } from "@/widgets/sales/sales-chart";
import { SalesPaymentMethods } from "@/widgets/sales/sales-payment-methods";
import { SalesOrderSources } from "@/widgets/sales/sales-order-sources";
import { SalesPopularProducts } from "@/widgets/sales/sales-popular-products";
import { SalesTable } from "@/widgets/sales/sales-table";

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <SalesHeader />
        <SalesToday />
        <SalesMainChart />
        <SalesMainKpis />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesPaymentMethods />
          <SalesOrderSources />
        </div>
        <SalesChart />
        <SalesPopularProducts />
        <SalesTable />
      </div>
    </div>
  );
}