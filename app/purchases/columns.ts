'use client'

import {ColumnDef} from '@tanstack/react-table'
import {PurchaseWithPlan} from './types' // Use the custom type

// Define columns for the DataTable
export const columns: ColumnDef<PurchaseWithPlan>[] = [
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({row}) => `$${row.original.amount.toFixed(2)}`, // Formatting currency
  },
  {
    accessorKey: 'purchase_date',
    header: 'Purchase Date',
    cell: ({row}) => new Date(row.original.purchase_date).toLocaleDateString(), // Formatting date
  },
  {
    accessorKey: 'plan.name', // Access the related plan's name
    header: 'Payment Plan',
    cell: ({row}) => row.original.plan?.name || 'N/A', // Show "N/A" if no plan
  },
]
