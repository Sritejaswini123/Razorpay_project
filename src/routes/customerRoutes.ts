import { Hono } from "hono";
import { createCustomerHandler, getAllCustomerHandler, getCustomrByIdHandler } from "../handlers/customerHandlers";
const customerRoutes = new Hono();
customerRoutes.post("/create-customer", createCustomerHandler);
customerRoutes.get("/get-customers", getAllCustomerHandler);
customerRoutes.get("/get/customers/:id", getCustomrByIdHandler);
export default customerRoutes;


