import * as dotenv from 'dotenv';
dotenv.config();

const APP_PORT = process.env.APP_PORT || 3001;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || '';

export {
  APP_PORT,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY,
};
