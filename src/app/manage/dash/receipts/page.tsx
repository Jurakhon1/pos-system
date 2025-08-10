"use client";

import { ReceiptsHeader } from "@/widgets/receipts/receipts-header";
import { ReceiptsFilters } from "@/widgets/receipts/receipts-filters";
import { ReceiptsSummary } from "@/widgets/receipts/receipts-summary";
import { ReceiptsTable } from "@/widgets/receipts/receipts-table";

export default function ReceiptsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <ReceiptsHeader />
        <ReceiptsFilters />
        {/* <ReceiptsSummary /> */}
        <ReceiptsTable />
      </div>
    </div>
  );
}


