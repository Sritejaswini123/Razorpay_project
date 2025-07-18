CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"customer_id" text,
	"status" text,
	"quantity" integer DEFAULT 1,
	"total_count" integer,
	"paid_count" integer,
	"current_start" integer,
	"current_end" integer,
	"ended_at" integer,
	"charge_at" integer,
	"start_at" integer,
	"end_at" integer,
	"expire_by" integer,
	"customer_notify" boolean,
	"notes" jsonb,
	"created_at" timestamp DEFAULT now()
);
