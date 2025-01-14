import { db } from './db.js'

export const createNewIcon = (id, data) => {
  db.data[id] = data
  return db.write()
}
