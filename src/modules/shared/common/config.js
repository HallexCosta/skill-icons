import { config as dotenvSafe } from 'dotenv-safe'

dotenvSafe({
  allowEmptyValues: true,
  example: `${process.cwd()}/.env.example`
})

export const config = {
  DB_URL: process.env.DB_URL
}
