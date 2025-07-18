import Razorpay from "razorpay";
import db from "../database/db";
import { subscriptions } from "../database/schemas/subscriptions";
import { eq } from "drizzle-orm";

type CreateSubscriptionPayload = {
  customer_id: string;
  plan_id: string;
  total_count: number;
  quantity?: number;
  start_at?: number;
  expire_by?: number;
  customer_notify?: boolean;
  addons?: any[];
  offer_id?: string;
  notes?: Record<string, string>;
  auth_type?: "upi" | "card";
};

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID!,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET!,
});

export const createSubscription = async (payload: CreateSubscriptionPayload) => {
  const subscription = await razorpay.subscriptions.create(payload);

  await db.insert(subscriptions).values({
    id: subscription.id,
    planId: subscription.plan_id,
    customerId: subscription.customer_id,
    status: subscription.status,
    quantity: subscription.quantity,
    totalCount: subscription.total_count,
    paidCount: subscription.paid_count,
    currentStart: subscription.current_start,
    currentEnd: subscription.current_end,
    endedAt: subscription.ended_at,
    chargeAt: subscription.charge_at,
    startAt: subscription.start_at,
    endAt: subscription.end_at,
    expireBy: subscription.expire_by,
    customerNotify: subscription.customer_notify === 1 ? true : subscription.customer_notify === 0 ? false : subscription.customer_notify,
    notes: subscription.notes,
  });
  return subscription;
};

export const getSubscription = async (id: string) => {
  const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
  return subscription;
};