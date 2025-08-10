"use client";

import { WorkshopsHeader } from "@/widgets/workshops/workshops-header";
import { WorkshopsFilters } from "@/widgets/workshops/workshops-filters";
import { WorkshopsTable } from "@/widgets/workshops/workshops-table";

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <WorkshopsHeader />
        <WorkshopsFilters />
        <WorkshopsTable />
      </div>
    </div>
  );
}
