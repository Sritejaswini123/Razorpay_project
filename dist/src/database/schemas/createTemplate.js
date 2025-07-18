import { index, pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";
export const createTemplate = pgTable("createTemplate", {
    id: serial().primaryKey(),
    templateName: text().notNull(),
    template_id: text(),
    language: text(),
    category: text().notNull(),
    status: text(),
    components: jsonb(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
}, t => [
    index("createTemplate_templateName_idx").on(t.templateName),
    index("createTemplate_template_id_idx").on(t.template_id),
]);
