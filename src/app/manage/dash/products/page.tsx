"use client";

import { useState } from "react";
import { ProductsHeader } from "@/widgets/products/products-header";
import { ProductsFilters } from "@/widgets/products/products-filters";
import { ProductsTable } from "@/widgets/products/products-table";
import { ProductsPagination } from "@/widgets/products/products-pagination";

export default function ProductsPage() {
  const [search, setSearch] = useState<string>("");
  const [advancedFilter, setAdvancedFilter] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <ProductsHeader />
        <ProductsFilters />
        <ProductsTable search={search} advancedFilter={advancedFilter} />
        <ProductsPagination />
      </div>
    </div>
  );
}


