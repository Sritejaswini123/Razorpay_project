import db from "../database/db";
import { subscriptionplans } from "../database/schemas/subscriptionPlan";
import Razorpay from "razorpay";
const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});
export async function createPlanService(planInput) {
    console.log("[createPlanService] Function called with input:", planInput);
    // Create plan in Razorpay
    console.log("[createPlanService] Creating plan in Razorpay...");
    const razorpayPlan = await razorpay.plans.create({
        period: planInput.period,
        interval: planInput.interval,
        item: {
            name: planInput.name,
            amount: planInput.amount * 100, // Convert to paise
            currency: planInput.currency,
            description: planInput.description,
        },
    });
    console.log("[createPlanService] Razorpay plan created:", {
        id: razorpayPlan.id,
        period: razorpayPlan.period,
        interval: razorpayPlan.interval,
        item: razorpayPlan.item,
    });
    // Save plan in DB
    console.log("[createPlanService] Inserting plan into database...");
    const [plan] = await db
        .insert(subscriptionplans)
        .values({
        razorpayPlanId: razorpayPlan.id,
        name: planInput.name,
        amount: planInput.amount,
        currency: planInput.currency,
        interval: planInput.interval,
        period: planInput.period,
        description: planInput.description,
    })
        .returning();
    console.log("[createPlanService] Plan successfully inserted into database:", plan);
    return plan;
}
export async function getAllPlansService() {
    console.log("[getAllPlansService] Fetching all plans from the database...");
    const plans = await db.select().from(subscriptionplans);
    console.log(`[getAllPlansService] Retrieved ${plans.length} plans.`);
    return plans;
}
