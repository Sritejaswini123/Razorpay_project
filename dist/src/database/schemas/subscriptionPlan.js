// // db/schema/plans.ts
// import { pgTable, serial, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
// export const plans = pgTable("plans", {
//   id: serial().primaryKey(),
//   razorpay_plans_id: varchar( { length: 255 }).notNull(),
//   period: varchar({ length: 50 }).notNull(),
//   interval: integer().notNull(),
//   item_name: varchar( { length: 255 }).notNull(),
//   item_amount: integer().notNull(),
//   item_currency: varchar({ length: 10 }).notNull(),
//   item_description: varchar( { length: 500 }),
//   notes: jsonb("notes"),
//   created_at: timestamp("created_at").defaultNow(),
//   updated_at: timestamp("updated_at").defaultNow().notNull()
// });
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
export const subscriptionplans = pgTable("subscriptionplans", {
    id: serial("id").primaryKey(),
    razorpayPlanId: text("razorpay_plan_id").notNull(),
    name: text("name").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    interval: integer("interval").notNull(),
    period: text("period").notNull(),
    description: text("description"),
});
