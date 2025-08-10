"use client";

import { CategoryHeader } from "@/widgets/category/category-header";
import { CategoryFilters } from "@/widgets/category/category-filters";
import { CategoryTable } from "@/widgets/category/category-table";

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <CategoryHeader />
        <CategoryFilters />
        <CategoryTable />
      </div>
    </div>
  );
}
