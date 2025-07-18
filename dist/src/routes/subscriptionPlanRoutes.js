// // routes/plan.route.ts
// import { Hono } from "hono";
// import { planHandler } from "../handlers/subscriptionPlanHandlers"
// const planRoute = new Hono();
// planRoute.route("/plans", planHandler);
// export default planRoute;
import { Hono } from "hono";
import { createPlanHandler, getAllPlansHandler } from "../handlers/subscriptionPlanHandlers";
const subscriptionPlanRoutes = new Hono();
subscriptionPlanRoutes.post("/plan", createPlanHandler);
subscriptionPlanRoutes.get("/get-plans", getAllPlansHandler);
export default subscriptionPlanRoutes;
