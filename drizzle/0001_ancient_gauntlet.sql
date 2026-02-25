CREATE TABLE "remote_rule" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "remote_rule_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"url" varchar NOT NULL,
	"proxy" varchar DEFAULT 'DIRECT' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp with time zone,
	"content" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "remote_rule_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX "remote_rule_idx" ON "remote_rule" USING btree ("id");--> statement-breakpoint
CREATE INDEX "remote_rule_name_idx" ON "remote_rule" USING btree ("name");