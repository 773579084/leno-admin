import dotenv from 'dotenv'
import path from 'path'

const customPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
console.log(3, process.env.NODE_ENV, customPath, process.cwd())

dotenv.config({ path: customPath })
