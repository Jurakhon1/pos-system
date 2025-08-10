"use client";

import { WaitersHeader } from "@/widgets/waiters/waiters-header";
import { WaitersFilters } from "@/widgets/waiters/waiters-filters";
import { WaitersTable } from "@/widgets/waiters/waiters-table";

export default function WaitersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <WaitersHeader />
        <WaitersFilters />
        <WaitersTable />
      </div>
    </div>
  );
}
