import {DataTable} from '@/components/ui/data-table'
import {columns} from './columns'
import prisma from '@/lib/prisma'

// This component renders the table on the client side
export default async function DataTableClient() {
  // Fetch purchases data from Prisma
  const purchases = await prisma.purchase.findMany({
    include: {plan: true},
  })
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Your Purchases</h1>
      <DataTable columns={columns} data={purchases} />
    </div>
  )
}
