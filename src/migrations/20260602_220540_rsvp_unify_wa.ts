import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_rsvps_members_role" AS ENUM('titular', 'agregado');
  CREATE TYPE "public"."enum_rsvps_whatsapp_status" AS ENUM('not_sent', 'sent', 'failed');
  ALTER TABLE "guests_dependents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "guests_dependents" CASCADE;
  DROP TABLE "guests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guests_fk";
  
  DROP INDEX "payload_locked_documents_rels_guests_id_idx";
  ALTER TABLE "rsvps_members" ADD COLUMN "role" "enum_rsvps_members_role" DEFAULT 'agregado' NOT NULL;
  ALTER TABLE "rsvps" ADD COLUMN "whatsapp_status" "enum_rsvps_whatsapp_status" DEFAULT 'not_sent';
  ALTER TABLE "rsvps" ADD COLUMN "whatsapp_sent_at" timestamp(3) with time zone;
  ALTER TABLE "rsvps" ADD COLUMN "whatsapp_last_error" varchar;
  CREATE UNIQUE INDEX "rsvps_token_idx" ON "rsvps" USING btree ("token");
  CREATE UNIQUE INDEX "rsvps_security_code_idx" ON "rsvps" USING btree ("security_code");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "guests_id";
  DROP TYPE "public"."enum_guests_dependents_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_guests_dependents_type" AS ENUM('spouse', 'child', 'other');
  CREATE TABLE "guests_dependents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"age" numeric NOT NULL,
  	"type" "enum_guests_dependents_type" NOT NULL
  );
  
  CREATE TABLE "guests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"confirmed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DROP INDEX "rsvps_token_idx";
  DROP INDEX "rsvps_security_code_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "guests_id" integer;
  ALTER TABLE "guests_dependents" ADD CONSTRAINT "guests_dependents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "guests_dependents_order_idx" ON "guests_dependents" USING btree ("_order");
  CREATE INDEX "guests_dependents_parent_id_idx" ON "guests_dependents" USING btree ("_parent_id");
  CREATE INDEX "guests_updated_at_idx" ON "guests" USING btree ("updated_at");
  CREATE INDEX "guests_created_at_idx" ON "guests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guests_fk" FOREIGN KEY ("guests_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_guests_id_idx" ON "payload_locked_documents_rels" USING btree ("guests_id");
  ALTER TABLE "rsvps_members" DROP COLUMN "role";
  ALTER TABLE "rsvps" DROP COLUMN "whatsapp_status";
  ALTER TABLE "rsvps" DROP COLUMN "whatsapp_sent_at";
  ALTER TABLE "rsvps" DROP COLUMN "whatsapp_last_error";
  DROP TYPE "public"."enum_rsvps_members_role";
  DROP TYPE "public"."enum_rsvps_whatsapp_status";`)
}
