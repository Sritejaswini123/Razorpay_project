import { Hono } from "hono";
import { createSubscriptionHandler } from "../handlers/subscriptionHandler";
const subscriptionRoutes = new Hono();
subscriptionRoutes.post("/subscribe", createSubscriptionHandler);
export default subscriptionRoutes;
