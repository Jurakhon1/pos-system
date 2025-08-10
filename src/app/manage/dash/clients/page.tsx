"use client";

import { ClientsHeader } from "@/widgets/clients/clients-header";
import { ClientsFilters } from "@/widgets/clients/clients-filters";
import { ClientsTable } from "@/widgets/clients/clients-table";

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <ClientsHeader />
        <ClientsFilters />
        <ClientsTable />
      </div>
    </div>
  );
}
