import { SERVICE_UP } from "./constants/app-messages.js";
import env from "./env.js";
import factory from "./factory.js";
import userRoutes from "./routes/userRoutes.js";
import notFound from "./utils/not-found.js";
import onError from "./utils/on-error.js";
import { piLogger } from "./utils/pino-logger.js";
import { sendResponse } from "./utils/send-response.js";

const app = factory.createApp().basePath(env.API_VERSION);
app.use(piLogger());

app.get("/", (c) => {
  return sendResponse(c, 200, SERVICE_UP);
});

console.log(SERVICE_UP,`http://localhost:3000/v1.0/`);


app.route('/', userRoutes);





app.get("/error", (c) => {
  c.status(422);
  c.var.logger.debug("Test error only visible in development");
  throw new Error("Test error");
});

app.notFound(notFound);
app.onError(onError);

export default app;
