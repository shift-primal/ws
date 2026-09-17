CREATE TABLE "category_rule" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"merchant" text NOT NULL,
	"category" "category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_rule" ADD CONSTRAINT "category_rule_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "category_rule_user_merchant_idx" ON "category_rule" USING btree ("user_id","merchant");