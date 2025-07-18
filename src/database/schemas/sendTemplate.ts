// db/schema/whatsappTemplates.ts
import { pgTable, text,  jsonb, timestamp, serial, index } from "drizzle-orm/pg-core";
export const whatsappTemplates = pgTable("whatsappTemplates", {
  id: serial().primaryKey(),
  name: text().notNull(),
  language: text().notNull(),
  status: text().notNull(),
  category: text(),
  components: jsonb(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
}, t => [
  index("whatsappTemplates_id_idx").on(t.id),
  index("whatsappTemplates_name_idx").on(t.name),
]);
export type WhatsappTemplateTable = typeof whatsappTemplates;
export type WhatsappTemplate = typeof whatsappTemplates.$inferSelect;
export type NewWhatsappTemplate = typeof whatsappTemplates.$inferInsert

