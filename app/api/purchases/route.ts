import {NextResponse} from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        plan: true, // Include payment plan details if needed
      },
    })
    return NextResponse.json({purchases})
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.error()
  }
}
