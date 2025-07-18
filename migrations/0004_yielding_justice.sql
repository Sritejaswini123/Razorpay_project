CREATE TABLE "createTemplate" (
	"id" serial PRIMARY KEY NOT NULL,
	"templateName" text NOT NULL,
	"template_id" text,
	"language" text NOT NULL,
	"category" text NOT NULL,
	"status" text,
	"components" jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "createTemplate_templateName_idx" ON "createTemplate" USING btree ("templateName");--> statement-breakpoint
CREATE INDEX "createTemplate_template_id_idx" ON "createTemplate" USING btree ("template_id");