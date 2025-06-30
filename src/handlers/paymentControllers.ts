// src/controllers/payControllers.ts
import type { Context } from "hono";

import { INVALID_VERIFICATION_CREDENTIALS, ORDER_CREATED, ORDER_CREATION_FAILED, PAYMENT_FAILED, PAYMENT_VERIFICATION_SUCCESS } from "../constants/app-messages";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http-status-codes";
import { createRazorpayOrder, updatePaymentOnVerification, verifyPaymentSignature } from "../service/paymentService";
// Create Order Handler
export async function createOrderHandler(c: Context) {
  try {
    const body = await c.req.json();
    const { amount, receipt } = body;
    if (!amount || !receipt) {
      return c.json({ message: "Amount and receipt are required" }, BAD_REQUEST);
    }
    const order = await createRazorpayOrder({ amount, receipt });
    return c.json({ ORDER_CREATED, order });
  }
  catch (error) {
    console.error(error);
    return c.json(ORDER_CREATION_FAILED, 500);
  }
}

// Verify Payment Handler
export async function handleVerifyPayment(c: Context) {
  try {
    const body = await c.req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const requiredFields = ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature"];
    const missingFields = requiredFields.filter(
      field => !body[field],
    );
    if (missingFields.length > 0) {
      return c.json(
        {
          success: false,
          message: `Missing required field(s): ${missingFields}`,
        },
        BAD_REQUEST,
      );
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (isValid) {
      await updatePaymentOnVerification(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      return c.json({ success: true, message: PAYMENT_VERIFICATION_SUCCESS });
    }
    else {
      return c.json({ success: false, message: INVALID_VERIFICATION_CREDENTIALS }, BAD_REQUEST);
    }
  }
  catch (error) {
    console.error(error);
    return c.json({ success: false, PAYMENT_FAILED }, INTERNAL_SERVER_ERROR);
  }
}
