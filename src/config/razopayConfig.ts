import envData from "../env.js";

export const razorpayConfig = {
  razor_pay_key_id: envData.RAZOR_PAY_KEY_ID!,
  razor_pay_key_secret: envData.RAZOR_PAY_KEY_SECRET!,
  currency: "INR",
};
