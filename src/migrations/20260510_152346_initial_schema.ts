import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_guests_dependents_type" AS ENUM('spouse', 'child', 'other');
  CREATE TYPE "public"."enum_background_media_location" AS ENUM('hero', 'middle', 'section1', 'section2', 'section3');
  CREATE TYPE "public"."enum_rsvps_members_status" AS ENUM('pending', 'confirmed', 'declined');
  CREATE TYPE "public"."enum_site_settings_fonts_font_type" AS ENUM('google', 'custom');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"cloudinary_player_u_r_l" varchar,
  	"cloudinary_public_id" varchar,
  	"cloudinary_resource_type" varchar,
  	"cloudinary_format" varchar,
  	"cloudinary_secure_url" varchar,
  	"cloudinary_bytes" numeric,
  	"cloudinary_created_at" varchar,
  	"cloudinary_version" varchar,
  	"cloudinary_version_id" varchar,
  	"cloudinary_width" numeric,
  	"cloudinary_height" numeric,
  	"cloudinary_duration" numeric,
  	"cloudinary_pages" numeric,
  	"cloudinary_selected_page" numeric DEFAULT 1,
  	"cloudinary_thumbnail_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
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
  
  CREATE TABLE "vertical_carousel_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "background_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"location" "enum_background_media_location" NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dress_code" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" varchar DEFAULT 'Esporte Fino' NOT NULL,
  	"description" varchar NOT NULL,
  	"for_her" varchar NOT NULL,
  	"for_him" varchar NOT NULL,
  	"media_id" integer NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gift_list" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"image_id" integer NOT NULL,
  	"price" numeric NOT NULL,
  	"payment_link" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rsvps_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"status" "enum_rsvps_members_status" DEFAULT 'pending'
  );
  
  CREATE TABLE "rsvps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"pending_count" numeric DEFAULT 0,
  	"token" varchar,
  	"security_code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "couple_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sender_name" varchar NOT NULL,
  	"sender_email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"guests_id" integer,
  	"vertical_carousel_media_id" integer,
  	"background_media_id" integer,
  	"dress_code_id" integer,
  	"gift_list_id" integer,
  	"rsvps_id" integer,
  	"couple_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"couple_couple_name" varchar DEFAULT 'Nome do Casal' NOT NULL,
  	"couple_groom_full_name" varchar DEFAULT 'Nome completo do noivo' NOT NULL,
  	"couple_bride_full_name" varchar DEFAULT 'Nome completo da noiva' NOT NULL,
  	"wedding_date" timestamp(3) with time zone NOT NULL,
  	"countdown_enabled" boolean DEFAULT true,
  	"colors_title_color" varchar DEFAULT '#ac5b30' NOT NULL,
  	"colors_subtitle_color" varchar DEFAULT '#6d4635' NOT NULL,
  	"colors_background_color" varchar DEFAULT '#fefaf6' NOT NULL,
  	"colors_button_color" varchar DEFAULT '#ac5b30' NOT NULL,
  	"colors_text_color" varchar DEFAULT '#6d4635' NOT NULL,
  	"fonts_font_type" "enum_site_settings_fonts_font_type" DEFAULT 'custom' NOT NULL,
  	"fonts_google_font_name" varchar,
  	"fonts_custom_font_upload_id" integer,
  	"payment_payment_method_name" varchar DEFAULT 'Pix',
  	"payment_default_payment_link" varchar,
  	"payment_payment_instructions" jsonb,
  	"seo_site_title" varchar DEFAULT 'Nosso Casamento' NOT NULL,
  	"seo_site_description" varchar DEFAULT 'Site oficial do nosso casamento',
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guests_dependents" ADD CONSTRAINT "guests_dependents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vertical_carousel_media" ADD CONSTRAINT "vertical_carousel_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "background_media" ADD CONSTRAINT "background_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dress_code" ADD CONSTRAINT "dress_code_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gift_list" ADD CONSTRAINT "gift_list_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rsvps_members" ADD CONSTRAINT "rsvps_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rsvps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guests_fk" FOREIGN KEY ("guests_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vertical_carousel_media_fk" FOREIGN KEY ("vertical_carousel_media_id") REFERENCES "public"."vertical_carousel_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_background_media_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."background_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dress_code_fk" FOREIGN KEY ("dress_code_id") REFERENCES "public"."dress_code"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gift_list_fk" FOREIGN KEY ("gift_list_id") REFERENCES "public"."gift_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rsvps_fk" FOREIGN KEY ("rsvps_id") REFERENCES "public"."rsvps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_couple_messages_fk" FOREIGN KEY ("couple_messages_id") REFERENCES "public"."couple_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_fonts_custom_font_upload_id_media_id_fk" FOREIGN KEY ("fonts_custom_font_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "guests_dependents_order_idx" ON "guests_dependents" USING btree ("_order");
  CREATE INDEX "guests_dependents_parent_id_idx" ON "guests_dependents" USING btree ("_parent_id");
  CREATE INDEX "guests_updated_at_idx" ON "guests" USING btree ("updated_at");
  CREATE INDEX "guests_created_at_idx" ON "guests" USING btree ("created_at");
  CREATE INDEX "vertical_carousel_media_media_idx" ON "vertical_carousel_media" USING btree ("media_id");
  CREATE INDEX "vertical_carousel_media_updated_at_idx" ON "vertical_carousel_media" USING btree ("updated_at");
  CREATE INDEX "vertical_carousel_media_created_at_idx" ON "vertical_carousel_media" USING btree ("created_at");
  CREATE INDEX "background_media_media_idx" ON "background_media" USING btree ("media_id");
  CREATE INDEX "background_media_updated_at_idx" ON "background_media" USING btree ("updated_at");
  CREATE INDEX "background_media_created_at_idx" ON "background_media" USING btree ("created_at");
  CREATE INDEX "dress_code_media_idx" ON "dress_code" USING btree ("media_id");
  CREATE INDEX "dress_code_updated_at_idx" ON "dress_code" USING btree ("updated_at");
  CREATE INDEX "dress_code_created_at_idx" ON "dress_code" USING btree ("created_at");
  CREATE INDEX "gift_list_image_idx" ON "gift_list" USING btree ("image_id");
  CREATE INDEX "gift_list_updated_at_idx" ON "gift_list" USING btree ("updated_at");
  CREATE INDEX "gift_list_created_at_idx" ON "gift_list" USING btree ("created_at");
  CREATE INDEX "rsvps_members_order_idx" ON "rsvps_members" USING btree ("_order");
  CREATE INDEX "rsvps_members_parent_id_idx" ON "rsvps_members" USING btree ("_parent_id");
  CREATE INDEX "rsvps_updated_at_idx" ON "rsvps" USING btree ("updated_at");
  CREATE INDEX "rsvps_created_at_idx" ON "rsvps" USING btree ("created_at");
  CREATE INDEX "couple_messages_updated_at_idx" ON "couple_messages" USING btree ("updated_at");
  CREATE INDEX "couple_messages_created_at_idx" ON "couple_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_guests_id_idx" ON "payload_locked_documents_rels" USING btree ("guests_id");
  CREATE INDEX "payload_locked_documents_rels_vertical_carousel_media_id_idx" ON "payload_locked_documents_rels" USING btree ("vertical_carousel_media_id");
  CREATE INDEX "payload_locked_documents_rels_background_media_id_idx" ON "payload_locked_documents_rels" USING btree ("background_media_id");
  CREATE INDEX "payload_locked_documents_rels_dress_code_id_idx" ON "payload_locked_documents_rels" USING btree ("dress_code_id");
  CREATE INDEX "payload_locked_documents_rels_gift_list_id_idx" ON "payload_locked_documents_rels" USING btree ("gift_list_id");
  CREATE INDEX "payload_locked_documents_rels_rsvps_id_idx" ON "payload_locked_documents_rels" USING btree ("rsvps_id");
  CREATE INDEX "payload_locked_documents_rels_couple_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("couple_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_fonts_fonts_custom_font_upload_idx" ON "site_settings" USING btree ("fonts_custom_font_upload_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "guests_dependents" CASCADE;
  DROP TABLE "guests" CASCADE;
  DROP TABLE "vertical_carousel_media" CASCADE;
  DROP TABLE "background_media" CASCADE;
  DROP TABLE "dress_code" CASCADE;
  DROP TABLE "gift_list" CASCADE;
  DROP TABLE "rsvps_members" CASCADE;
  DROP TABLE "rsvps" CASCADE;
  DROP TABLE "couple_messages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_guests_dependents_type";
  DROP TYPE "public"."enum_background_media_location";
  DROP TYPE "public"."enum_rsvps_members_status";
  DROP TYPE "public"."enum_site_settings_fonts_font_type";`)
}
