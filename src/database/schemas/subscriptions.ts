import { pgTable, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(), // Razorpay subscription ID
  planId: text("plan_id").notNull(),
  customerId: text("customer_id"),
  status: text("status"),
  quantity: integer("quantity").default(1),
  totalCount: integer("total_count"),
  paidCount: integer("paid_count"),
  currentStart: integer("current_start"),
  currentEnd: integer("current_end"),
  endedAt: integer("ended_at"),
  chargeAt: integer("charge_at"),
  startAt: integer("start_at"),
  endAt: integer("end_at"),
  expireBy: integer("expire_by"),
  customerNotify: boolean("customer_notify"),
  notes: jsonb("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});