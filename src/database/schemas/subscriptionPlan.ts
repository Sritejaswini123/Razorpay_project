// drizzle/schema/plans.ts
import { pgTable, serial, varchar, integer,timestamp, index } from "drizzle-orm/pg-core";
export const plans = pgTable("plans", {
  id: serial().primaryKey(),
  razorpayPlanId: varchar({ length: 255 }).unique().notNull(),
  name: varchar({ length: 255 }).notNull(),  
  description: varchar({ length: 500 }),
  amount: integer().notNull(),
  currency: varchar({ length: 10 }).default("INR").notNull(),
  period: varchar({ length: 50 }).notNull(), 
  interval: integer().notNull(), 
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
}, t => [
     index("plans_razorpay_plan_id_idx").on(t.razorpayPlanId),
     index("plans_name_idx").on(t.name),
     index("plans_period_idx").on(t.period),
    ]);



