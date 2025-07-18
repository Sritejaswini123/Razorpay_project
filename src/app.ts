import { cors } from "hono/cors";

import { SERVICE_UP } from "./constants/app-messages.js";
import env from "./env.js";
import factory from "./factory.js";
import payRoutes from "./routes/paymentRoutes.js";
import notFound from "./utils/not-found.js";
import onError from "./utils/on-error.js";
import { piLogger } from "./utils/pino-logger.js";
import { sendResponse } from "./utils/send-response.js";
import subscriptionPlanRoutes from "./routes/subscriptionPlanRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import whatsappRoute from "./routes/businessRoutes.js";
import webhook from "./routes/webhooks.js";
const app = factory.createApp().basePath(env.API_VERSION);

app.use(piLogger());
app.use("*", cors());
app.get("/test/:name", (c) => {
  const name = c.req.param("name");
  return c.text(`CORS is working!-->Hello ${name}!`);
});
app.get("/", (c) => {
  return sendResponse(c, 200, SERVICE_UP);
});
// user routes..........
console.log("inside app");
app.route("/", payRoutes);
app.route("/", subscriptionPlanRoutes)
app.route("/", customerRoutes)
app.route("/", subscriptionRoutes)
app.route("/", whatsappRoute )
app.route("/", webhook )

app.get("/error", (c) => {
  c.status(422);
  c.var.logger.debug("Test error only visible in development");
  throw new Error("Test error");
});
app.notFound(notFound);
app.onError(onError);

export default app;
