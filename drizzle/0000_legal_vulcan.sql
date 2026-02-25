CREATE TABLE "group" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "group_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"insertProxies" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "group_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "rule" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rule_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"value" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"remark" varchar,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rule_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "sub" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sub_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" varchar NOT NULL,
	"name" varchar NOT NULL,
	"content" text,
	"main" boolean DEFAULT false,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sub_url_unique" UNIQUE("url"),
	CONSTRAINT "sub_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX "group_idx" ON "group" USING btree ("id");--> statement-breakpoint
CREATE INDEX "rule_idx" ON "rule" USING btree ("id");--> statement-breakpoint
CREATE INDEX "sub_idx" ON "sub" USING btree ("id");--> statement-breakpoint
CREATE INDEX "sub_name_idx" ON "sub" USING btree ("name");