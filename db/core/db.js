import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

const dbDir = `${process.cwd()}/db`

export const db = new LowSync(new JSONFileSync(`${dbDir}/db.json`), {})
