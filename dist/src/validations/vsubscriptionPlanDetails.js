import { z } from "zod";
export const vsubscriptionPlanDetailsSchema = z.object({
    id: z.string().min(1, "ID is required"),
    razorpayPlanId: z.string().min(1, "Razorpay Plan ID is required"),
    name: z.string().min(1, "Plan name is required"),
    description: z.string().optional(),
    amount: z.number().int().positive("Amount must be a positive integer"),
    currency: z.string().min(1, "Currency is required").default("INR"),
    period: z.string().min(1, "Period is required"),
    interval: z.number().int().positive("Interval must be a positive integer"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
