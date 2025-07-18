// drizzle/schema/customers.ts

import { pgTable, serial, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: serial().primaryKey(),
  razorpayCustomerId: varchar({ length: 255 }).unique().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  contact: varchar({ length: 20 }),
  address:varchar({ length: 500 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
}, t => [
  index("customers_razorpay_customer_id_idx").on(t.razorpayCustomerId),
  index("customers_email_idx").on(t.email),
]);
