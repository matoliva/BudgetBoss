
'use client'

import { ColumnDef } from "@tanstack/react-table";
import {PurchaseWithPlan} from './types' // Use the custom type

export const columns: ColumnDef<PurchaseWithPlan>[] = [
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: true,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
    enableSorting: true,
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
    cell: ({ row }) => new Date(row.original.purchase_date).toLocaleDateString(),
    enableSorting: true,
  },
  {
    accessorKey: "plan.name",
    header: "Payment Plan",
    cell: ({ row }) => row.original.plan?.name || "N/A",
    enableSorting: true,
  },
];
