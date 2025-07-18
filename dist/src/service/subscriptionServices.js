import Razorpay from "razorpay";
import db from "../database/db";
import { subscriptions } from "../database/schemas/subscriptions";
import { eq } from "drizzle-orm";
const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});
export const createSubscription = async (payload) => {
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
export const getSubscription = async (id) => {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
};
