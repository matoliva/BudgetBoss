import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';  // Adjust the path if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, amount, purchaseDate, planId, userId } = body;

    // Validate the request data
    if (!description || !amount || !purchaseDate || !planId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate if the user && payment plan exist
    const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      const plan = await prisma.paymentPlan.findUnique({
        where: { id: planId },
      });
      
      if (!user || !plan) {
        return NextResponse.json(
          { error: 'Invalid user or payment plan ID' },
          { status: 400 }
        );
      }
      

    // Create a new purchase in the database
    const purchase = await prisma.purchase.create({
      data: {
        description,
        amount: parseFloat(amount),  // Convert amount to a float
        purchase_date: new Date(purchaseDate),
        user_id: userId,  // Make sure this is properly linked with your user
        plan_id: planId,  // Link the purchase to a payment plan
      },
    });

    // Return the created purchase
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
