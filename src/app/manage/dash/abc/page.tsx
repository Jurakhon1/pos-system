"use client";

import { AbcHeader } from "@/widgets/abc/abc-header";
import { AbcFilters } from "@/widgets/abc/abc-filters";
import { AbcTable } from "@/widgets/abc/abc-table";

export default function AbcPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <AbcHeader />
        <AbcFilters />
        <AbcTable />
      </div>
    </div>
  );
}


