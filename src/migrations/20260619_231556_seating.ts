import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Apenas o schema da feature "Mesas": tabela `tables`, a coluna de alocação
// `rsvps.assigned_table_id` e a coluna do join de locks do Payload. Tudo aditivo
// e não-destrutivo (o diff automático do migrate:create vinha contaminado com
// mudanças já presentes no banco, então esta migração foi enxugada à mão).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_tables_shape" AS ENUM('round', 'square', 'rectangle');
  CREATE TABLE "tables" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric NOT NULL,
  	"shape" "enum_tables_shape" DEFAULT 'round' NOT NULL,
  	"capacity" numeric DEFAULT 10 NOT NULL,
  	"pos_x" numeric DEFAULT 50,
  	"pos_y" numeric DEFAULT 50,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  ALTER TABLE "rsvps" ADD COLUMN "assigned_table_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tables_id" integer;
  CREATE INDEX "tables_updated_at_idx" ON "tables" USING btree ("updated_at");
  CREATE INDEX "tables_created_at_idx" ON "tables" USING btree ("created_at");
  ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_assigned_table_id_tables_id_fk" FOREIGN KEY ("assigned_table_id") REFERENCES "public"."tables"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tables_fk" FOREIGN KEY ("tables_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "rsvps_assigned_table_idx" ON "rsvps" USING btree ("assigned_table_id");
  CREATE INDEX "payload_locked_documents_rels_tables_id_idx" ON "payload_locked_documents_rels" USING btree ("tables_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "rsvps" DROP CONSTRAINT IF EXISTS "rsvps_assigned_table_id_tables_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_tables_fk";
  DROP INDEX IF EXISTS "rsvps_assigned_table_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_tables_id_idx";
  ALTER TABLE "rsvps" DROP COLUMN IF EXISTS "assigned_table_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "tables_id";
  DROP TABLE IF EXISTS "tables" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_tables_shape";`)
}
