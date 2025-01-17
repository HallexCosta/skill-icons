// import db from '../db.json'

export const getIconByAlias = async (db, alias) => {
  let foundIcon = null

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
