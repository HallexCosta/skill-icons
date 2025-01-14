import { db } from './db.js'
import { getIconById } from './getIconById.js'

export const updateIconAlias = (id, alias) => {
  const icon = getIconById(id)

  if (!icon) {
    return
  }
  const set = new Set([...db.data[id].alias, alias])
  db.data[id].alias = [...set]
  db.write()
}
