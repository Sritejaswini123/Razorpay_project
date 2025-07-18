// // handlers/plan.handler.ts
// import { createPlan } from "../service/subscriptionPlanServices";
// import { Hono } from "hono";
// import { zValidator } from "@hono/zod-validator";
// import { z } from "zod";
import { createPlanService, getAllPlansService } from "../service/subscriptionPlanServices";
export async function createPlanHandler(c) {
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
            return c.json({ error: `Missing required field(s): ${missingFields.join(", ")}` }, 400);
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
    }
    catch (err) {
        console.error("[createPlanHandler] Error occurred:", err);
        return c.json({
            error: err.message || "Internal Server Error",
            details: err,
        }, 500);
    }
}
export async function getAllPlansHandler(c) {
    console.log("[getAllPlansHandler] Handler called.");
    try {
        const plans = await getAllPlansService();
        console.log("[getAllPlansHandler] Plans fetched successfully.");
        return c.json({ plans }, 200);
    }
    catch (err) {
        console.error("[getAllPlansHandler] Error occurred:", err);
        return c.json({
            error: err.message || "Internal Server Error",
            details: err,
        }, 500);
    }
}
