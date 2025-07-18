// // handlers/plan.handler.ts
// import { createPlan } from "../service/subscriptionPlanServices";
// import { Hono } from "hono";
// import { zValidator } from "@hono/zod-validator";
// import { z } from "zod";

// const createPlanSchema = z.object({
//   period: z.enum(["daily", "weekly", "monthly", "yearly"]),
//   interval: z.number().min(1),
//   item: z.object({
//     name: z.string().min(5),
//     amount: z.number().min(1),
//     currency: z.string().min(1),
//     description: z.string().optional(),
//   }),
//   notes: z.record(z.any()).optional(),
// });

// export const planHandler = new Hono()
//   .post("/",zValidator("json", createPlanSchema),
//     async (c) => {
//       const body = c.req.valid("json");
//       try {
//         const plan = await createPlan(body);
//         return c.json({ success: true, data: plan });
//       } catch (err: any) {
//         console.error(err);
//         return c.json({ success: false, message: err.message }, 500);
//       }
//     }
//   );


import { Context } from "hono";
import { createPlanService , getAllPlansService} from "../service/subscriptionPlanServices";

export async function createPlanHandler(c: Context) {
  console.log("[createPlanHandler] Handler called.");

  try {
    const body = await c.req.json();
    console.log("[createPlanHandler] Request body received:", body);

    const { name, amount, currency, interval, period, description } = body;

    const requiredFields = { name, amount, currency, interval, period };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value === undefined || value === null || value === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log("[createPlanHandler] Missing required fields:", missingFields);
      return c.json(
        { error: `Missing required field(s): ${missingFields.join(", ")}` },
        400
      );
    }

    console.log("[createPlanHandler] Calling createPlanService with:", {
      name,
      amount,
      currency,
      interval,
      period,
      description,
    });

    const plan = await createPlanService({
      name,
      amount,
      currency,
      interval,
      period,
      description,
    });

    console.log("[createPlanHandler] Plan successfully created:", plan);

    return c.json({ plan }, 201);
  } catch (err: any) {
    console.error("[createPlanHandler] Error occurred:", err);
    return c.json(
      {
        error: err.message || "Internal Server Error",
        details: err,
      },
      500
    );
  }
}




export async function getAllPlansHandler(c: Context) {
  console.log("[getAllPlansHandler] Handler called.");

  try {
    const plans = await getAllPlansService();
    console.log("[getAllPlansHandler] Plans fetched successfully.");
    return c.json({ plans }, 200);
  } catch (err: any) {
    console.error("[getAllPlansHandler] Error occurred:", err);
    return c.json(
      {
        error: err.message || "Internal Server Error",
        details: err,
      },
      500
    );
  }
}