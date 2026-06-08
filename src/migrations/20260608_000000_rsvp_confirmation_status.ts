import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_rsvps_confirmation_status" AS ENUM('pending', 'confirmed', 'declined', 'partial');
  ALTER TABLE "rsvps" ADD COLUMN "confirmation_status" "enum_rsvps_confirmation_status" DEFAULT 'pending';

  -- Backfill: calcula o status agregado a partir dos membros existentes.
  UPDATE "rsvps" r SET "confirmation_status" = sub.status::"enum_rsvps_confirmation_status"
  FROM (
    SELECT
      "_parent_id",
      CASE
        WHEN SUM(CASE WHEN "status" = 'pending' THEN 1 ELSE 0 END) > 0 THEN 'pending'
        WHEN SUM(CASE WHEN "status" = 'confirmed' THEN 1 ELSE 0 END) > 0
             AND SUM(CASE WHEN "status" = 'declined' THEN 1 ELSE 0 END) = 0 THEN 'confirmed'
        WHEN SUM(CASE WHEN "status" = 'declined' THEN 1 ELSE 0 END) > 0
             AND SUM(CASE WHEN "status" = 'confirmed' THEN 1 ELSE 0 END) = 0 THEN 'declined'
        ELSE 'partial'
      END AS status
    FROM "rsvps_members"
    GROUP BY "_parent_id"
  ) sub
  WHERE r."id" = sub."_parent_id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "rsvps" DROP COLUMN "confirmation_status";
  DROP TYPE "public"."enum_rsvps_confirmation_status";`)
}
