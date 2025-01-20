import * as icons from '../../../../dist/icons.json'
import { cachedDb } from '../db/cachedDb'
import { iconProvider } from '../providers/iconProvider'
import { cacheNames } from '../workers/cache/caches'

type Theme = 'light' | 'dark' | 'original'

interface Icon {
  defaultTheme: Theme
  theme: Theme[]
  alias: string[]
}

interface GetOrCreateCachedDb {
  url: string
  timeInSeconds: number
}

async function findByAlias(alias: string) {
  let foundIcon: { icon: Icon; id: typeof icons } | null = null

  const db = iconService.db
  for (const id in db) {
    if (iconService.db[id].alias.includes(alias)) {
      foundIcon = {
        id,
        icon: db[id]
      }
      break
    }
  }

  return foundIcon
}

async function getOrCreateCachedDb({
  url,
  timeInSeconds = 0
}: GetOrCreateCachedDb) {
  const dbUrl = new URL(url)
  const dbCacheKey = new Request(dbUrl.toString())

  if (!url) {
    console.error('getOrCreateCachedDb is required url')
    return {
      error: 'db url is required',
      data: null
    }
  }

  if (!timeInSeconds) timeInSeconds = 3600 // 1 hour

  const alreadyCachedDb = cachedDb.get(cacheNames.CACHED_DB_NAME)
  if (alreadyCachedDb) {
    console.log('Memory hit for some user')
    return {
      error: null,
      data: alreadyCachedDb
    }
  }

  const dbCache = await caches.open(cacheNames.CACHED_DB_NAME)

  let dbCacheResponse = await dbCache.match(dbCacheKey)

  if (!dbCacheResponse) {
    console.log(
      `Response for request url: ${dbCacheKey.url} not present in cache. Fetching and caching request.`
    )
    // If not in cache, get it from origin
    dbCacheResponse = await iconProvider.fetchSkillIconsDb(dbCacheKey.url)

    if (!dbCacheResponse) {
      return {
        error: 'dbCache: failed request skill icons db',
        data: null
      }
    }

    // Must use Response constructor to inherit all of response's fields
    dbCacheResponse = new Response(dbCacheResponse.body)

    // Cache API respects Cache-Control headers. Setting s-max-age to 10
    // will limit the response to be in cache for 3600 seconds max (1 hour)
    // Any changes made to the response here will be reflected in the cached value
    dbCacheResponse.headers.append('Cache-Control', `s-maxage=${timeInSeconds}`)
    const response = dbCache.put(dbCacheKey, dbCacheResponse.clone())
    cachedDb.put(cacheNames.CACHED_DB_NAME, await dbCacheResponse.json())
    return {
      error: null,
      data: response
    }
  }

  console.log('Cache hit for some user')
  cachedDb.put(cacheNames.CACHED_DB_NAME, await dbCacheResponse.json())
  return {
    error: null,
    data: cachedDb.get(cacheNames.CACHED_DB_NAME)
  }
}

const isRequestIconHasTheme = (requestIcon: string) => requestIcon.includes(':')

async function processRequestedIconAsync(requestIcon: string) {
  const icon = await findByAlias(requestIcon)
  if (!icon) return null

  if (!isRequestIconHasTheme(requestIcon)) {
    return icons[`${icon.icon.defaultTheme}:${icon.id}`] ?? null
  }
  return icons[requestIcon]
}

function processInParallel(requestIcons: string[]) {
  return Promise.all(requestIcons.map(processRequestedIconAsync))
}

export const iconService = {
  get db() {
    return cachedDb.get(cacheNames.CACHED_DB_NAME)
  },
  getOrCreateCachedDb,
  processRequestedIconAsync,
  processInParallel
}
