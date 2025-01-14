import { db } from './db.js'

export const getIconById = (id) => {
  const icon = db.adapter.read()[id] ?? null
  if (!icon) {
    return null
  }
  return icon
}
