import { config as dotenvSafe } from 'dotenv-safe'

dotenvSafe({
  allowEmptyValues: true,
  example: `${process.cwd()}/.env.example`
})

const config = {
  DB_URL: process.env.DB_URL!,
  GIST_ID_ICONS_DB: process.env.GIST_ID_ICONS_DB!,
  GH_PERSONAL_ACCESS_TOKEN: process.env.GH_PERSONAL_ACCESS_TOKEN!
}

type ConfigKeys = keyof typeof config

export { config, type ConfigKeys }
