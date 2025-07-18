// handlers/customerHandler.ts

import { Hono } from "hono";
import { createCustomer , getAllCustomers, getCustomerById} from "../service/customersServices";
import type { Context } from "hono";
export const customerHandler = new Hono();

// Create customer
export async function createCustomerHandler(c: Context) {
  try {
    const data = await c.req.json();
    const customer = await createCustomer(data);
    return c.json(customer);
  } catch (error) {
    console.error("Create customer error:", error);
    return c.json({ error: "Failed to create customer" }, 500);
  }
}
// Get all customers
export async function getAllCustomerHandler(c: Context) {
  try {
    const customers = await getAllCustomers();
    return c.json(customers);
  } catch (error) {
    console.error("Fetch customers error:", error);
    return c.json({ error: "Failed to fetch customers" }, 500);
  }
}

// Get customer by ID
export async function getCustomrByIdHandler(c: Context) {
  try {
    const id = Number(c.req.param("id"));
    const customer = await getCustomerById(id);
    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }
    return c.json(customer);
  } catch (error) {
    console.error("Fetch customer by ID error:", error);
    return c.json({ error: "Failed to fetch customer" }, 500);
  }
}

