import {PaymentPlan, Purchase} from '@prisma/client'

// Extend the Purchase type to include the related PaymentPlan
export type PurchaseWithPlan = Purchase & {
  plan: PaymentPlan | null // Assuming the plan can be null
}
