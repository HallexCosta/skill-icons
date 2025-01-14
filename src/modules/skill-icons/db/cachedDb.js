let _cachedDb = null

function get() {
  return _cachedDb
}

function put(db) {
  _cachedDb = db
  return db
}

export const cachedDb = {
  get,
  put
}
