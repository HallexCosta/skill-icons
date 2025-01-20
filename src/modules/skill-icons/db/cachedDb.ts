export const CACHED_DB_NAME = 'CACHED_DB_NAME'
const _cachedDbs = new Map()

function get(cacheName: string) {
  if (!cacheName) {
    return console.error('cachedDb.get: cacheName is required')
  }

  return _cachedDbs.get(cacheName)
}

function put(cacheName: string, db: any) {
  if (!(typeof cacheName === 'string')) {
    return console.error(
      `cacheName: expected string received ${typeof cacheName}`
    )
  }
  if (!(typeof db === 'object')) {
    return console.error(`db: expected object received ${typeof db}`)
  }

  _cachedDbs.set(cacheName, db)
  return db
}

const _delete = (cacheName: string) => _cachedDbs.delete(cacheName)

const clear = () => _cachedDbs.clear()

export const cachedDb = {
  get,
  put,
  delete: _delete,
  clear,
  CACHED_DB_NAME
}
