CREATE TABLE "whatsappTemplates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"language" text NOT NULL,
	"status" text NOT NULL,
	"category" text,
	"components" jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "whatsappTemplates_id_idx" ON "whatsappTemplates" USING btree ("id");--> statement-breakpoint
CREATE INDEX "whatsappTemplates_name_idx" ON "whatsappTemplates" USING btree ("name");