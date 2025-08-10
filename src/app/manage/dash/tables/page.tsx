"use client";

import { TablesHeader } from "@/widgets/tables/tables-header";
import { TablesFilters } from "@/widgets/tables/tables-filters";
import { TablesTable } from "@/widgets/tables/tables-table";

export default function TablesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <TablesHeader />
        <TablesFilters />
        <TablesTable />
      </div>
    </div>
  );
}
