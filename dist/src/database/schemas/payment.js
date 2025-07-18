// src/db/schema/payments.ts
import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull(),
    receipt: varchar("receipt", { length: 255 }).notNull(),
    razorpay_order_id: varchar("razorpay_order_id", { length: 255 }).notNull(),
    razorpay_payment_id: varchar("razorpay_payment_id", { length: 255 }),
    razorpay_signature: varchar("razorpay_signature", { length: 255 }),
    status: varchar("status", { length: 50 }).notNull().default("created"),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});
