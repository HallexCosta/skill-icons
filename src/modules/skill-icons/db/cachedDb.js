let _cachedDbs = new Map()

const get = (url) => {
  if (!url) return console.error('cachedDb.get: url is required')

  return _cachedDbs.get(url)
}

const put = (url, db) => {
  if (!(typeof url === 'string')) return console.error(`url: expected string received ${typeof url}`)
  if (!(typeof db === 'object')) return console.error(`db: expected object received ${typeof db}`)

  _cachedDbs.set(url, db)
  return db
}

const _delete = (url) => _cachedDbs.delete(url)

export const cachedDb = {
  get,
  put,
  delete: _delete
}
