import { Hono } from "hono";
import { createOrderHandler, handleVerifyPayment } from "../handlers/paymentControllers";
const payRoutes = new Hono();
payRoutes.post("/create-order", createOrderHandler);
payRoutes.post("/verify-payment", handleVerifyPayment);
export default payRoutes;
