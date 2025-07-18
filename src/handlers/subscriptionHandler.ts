import { Hono } from "hono";
import { createSubscription, getSubscription } from "../service/subscriptionServices";
import { Context } from "hono";
export const subscriptionHandler = new Hono();

// Create Subscription
export async function createSubscriptionHandler(c: Context) {
  try {
    const body = await c.req.json(); 
    const {
        customer_id,
      plan_id,
      total_count,
      quantity,
      start_at,
      expire_by,
      customer_notify,
      addons,
      offer_id,
      notes,
    } = body;

    const subscription = await createSubscription({
        customer_id,
      plan_id,
      total_count,
      quantity,
      start_at,
      expire_by,
      customer_notify,
      addons,
      offer_id,
      notes,
    });

    return c.json({ subscription });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create subscription" }, 500);
  }
}

// Get Subscription (optional, for verifying stored subscription)
subscriptionHandler.get("/subscriptions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const subscription = await getSubscription(id);
    if (!subscription) {
      return c.json({ error: "Subscription not found" }, 404);
    }
    return c.json({ subscription });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch subscription" }, 500);
  }
});