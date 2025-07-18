CREATE TABLE "subscriptionplans" (
	"id" serial PRIMARY KEY NOT NULL,
	"razorpay_plan_id" text NOT NULL,
	"name" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"interval" integer NOT NULL,
	"period" text NOT NULL,
	"description" text
);
--> statement-breakpoint
DROP TABLE "plans" CASCADE;