import dotenv from 'dotenv'
const path = require('path');
const customPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: customPath })


