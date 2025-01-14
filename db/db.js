import { createNewIcon } from './core/createNewIcon.js'
import { db } from './core/db.js'
import { getIconByAlias } from './core/getIconByAlias.js'
import { getIconById } from './core/getIconById.js'
import { updateIconAlias } from './core/updateIconAlias.js'
import { updateIconThemes } from './core/updateIconThemes.js'

export {
  db,
  getIconById,
  createNewIcon,
  updateIconAlias,
  updateIconThemes,
  getIconByAlias
}
