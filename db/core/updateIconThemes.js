import { db } from './db.js'
import { getIconById } from './getIconById.js'

export const updateIconThemes = (id, newTheme) => {
  const icon = getIconById(id)

  if (!icon || icon.themes.includes(newTheme)) {
    return
  }

  db.data[id].themes.push(newTheme)
  db.write()
}
