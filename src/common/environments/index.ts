import * as dotenv from 'dotenv';
dotenv.config();

const APP_NAME = process.env.APP_NAME || '';
const APP_PORT = process.env.APP_PORT || 3001;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL || '';
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD || '';
const NODEMAILER_HOST = process.env.NODEMAILER_HOST || '';
const CLIENT_URL = process.env.CLIENT_URL || '';

export {
  APP_NAME,
  APP_PORT,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD,
  NODEMAILER_HOST,
  CLIENT_URL,
};
