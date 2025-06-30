// src/service/paymentService.ts
import Razorpay from "razorpay";
import crypto from "crypto";
import db from "../database/db";
import { payments } from "../database/schemas/payment";
import { razorpayConfig } from "../config/razopayConfig";
import { eq } from "drizzle-orm";
export async function createRazorpayOrder({ amount, currency = razorpayConfig.currency, receipt }) {
    const razorpay = new Razorpay({
        key_id: razorpayConfig.razor_pay_key_id,
        key_secret: razorpayConfig.razor_pay_key_secret,
    });
    const data = { amount, currency, receipt };
    const order = await razorpay.orders.create(data);
    // Insert order in DB
    await db.insert(payments).values({
        amount,
        currency: order.currency ?? "",
        receipt: order.receipt ?? "",
        razorpay_order_id: order.id ?? "",
        status: "created",
    });
    return order;
}
export function verifyPaymentSignature(orderId, paymentId, signature) {
    const generatedSignature = crypto
        .createHmac("sha256", razorpayConfig.razor_pay_key_secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    return generatedSignature === signature;
}
export async function updatePaymentOnVerification(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
    await db.update(payments)
        .set({
        razorpay_payment_id,
        razorpay_signature,
        status: "paid",
        updated_at: new Date(),
    })
        .where(eq(payments.razorpay_order_id, razorpay_order_id));
}
