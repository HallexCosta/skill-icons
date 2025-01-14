// import db from '../db.json'

import { cachedDb } from '../../src/modules/skill-icons/db/cachedDb.js'

export const getIconByAlias = async (alias) => {
  let foundIcon = null

  const db = cachedDb.get()

  for (const id in db) {
    if (db[id].alias.includes(alias)) {
      foundIcon = {
        id,
        icon: db[id]
      }
      break
    }
  }
  return foundIcon
}
