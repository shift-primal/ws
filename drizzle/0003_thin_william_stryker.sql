DROP INDEX "category_rule_user_merchant_idx";--> statement-breakpoint
ALTER TABLE "category_rule" ADD COLUMN "counterparty" text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "category_rule_user_merchant_counterparty_idx" ON "category_rule" USING btree ("user_id","merchant","counterparty");