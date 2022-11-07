import * as dotenv from 'dotenv';
dotenv.config();

const APP_PORT = process.env.APP_PORT || 3001;

export { APP_PORT };
