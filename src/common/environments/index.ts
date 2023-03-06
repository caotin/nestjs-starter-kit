import * as dotenv from 'dotenv';
dotenv.config();

const APP_PORT = process.env.APP_PORT || 3001;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const GOOGLE_CLIENT_ID = String(process.env.GG_CLIENT_ID) || '';
const GOOGLE_CLIENT_SECRET = String(process.env.GG_CLIENT_SECRET) || '';

const FACEBOOK_ID = String(process.env.FB_ID) || '';
const FACEBOOK_SECRET = String(process.env.FB_SECRET) || '';

export {
  APP_PORT,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY,
  STRIPE_WEBHOOK_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_ID,
  FACEBOOK_SECRET
};
