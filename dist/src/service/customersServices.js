// services/customerService.ts
import db from "../database/db";
import { customers } from "../database/schemas/customers";
import { eq } from "drizzle-orm";
import Razorpay from "razorpay";
// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});
export const createCustomer = async (data) => {
    //Create customer on Razorpay
    const razorpayCustomer = await razorpay.customers.create({
        name: data.name,
        email: data.email,
        contact: data.contact,
        notes: data.notes,
    });
    //Insert into your database with Razorpay customer ID
    const [created] = await db.insert(customers).values({
        razorpayCustomerId: razorpayCustomer.id,
        name: data.name,
        email: data.email,
        contact: data.contact,
        address: data.address,
    }).returning();
    return created;
};
export const getAllCustomers = async () => {
    return db.select().from(customers);
};
export const getCustomerById = async (id) => {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
};
