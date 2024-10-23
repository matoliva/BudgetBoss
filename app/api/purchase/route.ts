import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { description, amount, purchaseDate, userId, planId, frequency } = await request.json();

    // Fetch the selected payment plan
    const plan = await prisma.paymentPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      throw new Error('Payment plan not found');
    }

    // Calculate the payment amount based on the selected frequency
    const totalMonths = plan.total_duration_in_months;
    const paymentAmount = calculatePayment(amount, totalMonths, frequency);

    // Create the purchase in the database
    const purchase = await prisma.purchase.create({
      data: {
        description,
        amount: parseFloat(amount),
        purchase_date: new Date(purchaseDate),
        user: { connect: { id: userId } },
        plan: { connect: { id: planId } },
      },
    });

    // Generate reminders for the next 3 months only
    const reminders = generateRemindersForNext3Months(purchaseDate, userId, purchase.id, frequency);

    // Save reminders to the database
    await prisma.reminder.createMany({
      data: reminders,
    });

    return NextResponse.json({ purchase, paymentAmount, reminders }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase and reminders:', error);
    return NextResponse.json({ error: 'Failed to create purchase and reminders' }, { status: 500 });
  }
}

// Calculate payment based on the frequency
function calculatePayment(amount: number, totalMonths: number, frequency: 'week' | 'fortnight' | 'month') {
  let periods: number;

  switch (frequency) {
    case 'week':
      periods = totalMonths * 4;
      break;
    case 'fortnight':
      periods = totalMonths * 2;
      break;
    case 'month':
      periods = totalMonths;
      break;
  }

  return amount / periods;
}

// Generate reminders for the next 3 months
function generateRemindersForNext3Months(purchaseDate: string, userId: number, purchaseId: number, frequency: 'week' | 'fortnight' | 'month') {
    const reminders = [];
    const reminderDate = new Date(purchaseDate);
  
    const reminderPeriods = getReminderPeriods(frequency);
  
    for (let i = 0; i < 3; i++) { // Only generate for the next 3 months
      reminderDate.setDate(reminderDate.getDate() + reminderPeriods);
  
      // Make sure reminderDate is a valid Date object
      if (isNaN(reminderDate.getTime())) {
        throw new Error('Invalid reminder date');
      }
  
      reminders.push({
        reminder_date: new Date(reminderDate), // Ensure this is a valid Date object
        status: 'pending',
        user_id: userId,
        purchase_id: purchaseId,
      });
    }
  
    return reminders;
  }
  

// Helper function to determine reminder periods based on frequency
function getReminderPeriods(frequency: 'week' | 'fortnight' | 'month') {
    switch (frequency) {
      case 'week':
        return 7; // Days in a week
      case 'fortnight':
        return 14; // Days in two weeks
      case 'month':
        return 30; // Approx days in a month
    }
}
