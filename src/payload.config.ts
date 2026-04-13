import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { cloudinaryStorage } from 'payload-cloudinary';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Collections
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Guests } from './collections/Guests';
import { VerticalCarouselMedia } from './collections/VerticalCarouselMedia';
import { BackgroundMedia } from './collections/BackgroundMedia';
import { GiftList } from './collections/GiftList';
import { RSVPs } from './collections/RSVP';

// Globals
import { SiteSettings } from './globals/SiteSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const rawDatabaseConnectionString =
  process.env.PAYLOAD_DATABASE_URI ||
  'postgresql://postgres:postgres@127.0.0.1:5432/wedding_renan_heloisa?sslmode=disable';

const parsedDatabaseURL = new URL(rawDatabaseConnectionString);
const sslMode = parsedDatabaseURL.searchParams.get('sslmode');
const isDatabaseSslDisabled = sslMode === 'disable';

// Keep SSL behavior in code so pg does not override cert settings from URL params.
parsedDatabaseURL.searchParams.delete('sslmode');
parsedDatabaseURL.searchParams.delete('sslrootcert');
parsedDatabaseURL.searchParams.delete('sslcert');
parsedDatabaseURL.searchParams.delete('sslkey');

const databaseConnectionString = parsedDatabaseURL.toString();
const databaseCaCertPath = process.env.PAYLOAD_DATABASE_CA_CERT_PATH;
const databaseSslRejectUnauthorized =
  process.env.PAYLOAD_DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';

const databaseSslConfig = isDatabaseSslDisabled
  ? false
  : {
      rejectUnauthorized: databaseSslRejectUnauthorized,
      ...(databaseCaCertPath
        ? {
            ca: fs.readFileSync(path.resolve(process.cwd(), databaseCaCertPath), 'utf8'),
          }
        : {}),
    };

const cloudinaryEnabled =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

const smtpEnabled =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASS);

const plugins = cloudinaryEnabled
  ? [
      cloudinaryStorage({
        config: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
          api_key: process.env.CLOUDINARY_API_KEY as string,
          api_secret: process.env.CLOUDINARY_API_SECRET as string,
        },
        collections: {
          media: true,
        },
        folder: process.env.CLOUDINARY_FOLDER || 'wedding-renan-heloisa',
      }),
    ]
  : [];

const email = smtpEnabled
  ? nodemailerAdapter({
      defaultFromAddress:
        process.env.SMTP_FROM_ADDRESS || 'no-reply@renan-heloisa.local',
      defaultFromName: process.env.SMTP_FROM_NAME || 'Site do Casamento',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 2525),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined;

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Painel do Casamento',
    },
    components: {
      afterDashboard: ['@/components/payload/DashboardStats#default'],
    },
  },
  collections: [
    Users,
    Media,
    Guests,
    VerticalCarouselMedia,
    BackgroundMedia,
    GiftList,
    RSVPs,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'PLEASE-CHANGE-THIS-SECRET',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseConnectionString,
      ssl: databaseSslConfig,
    },
  }),
  email,
  plugins,
  sharp,
});
