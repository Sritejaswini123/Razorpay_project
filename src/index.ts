import { serve } from "@hono/node-server";
import app from "./app.js";
import env from "./env.js";

const port = env.PORT;


serve({
  fetch: app.fetch,  
  hostname: "192.168.1.41",
  port,
});
console.log(` Server running at http://192.168.1.41:${port}/${env.API_VERSION}/`);


//http://192.168.1.41:3000/api/users?limit=5&offset=0
