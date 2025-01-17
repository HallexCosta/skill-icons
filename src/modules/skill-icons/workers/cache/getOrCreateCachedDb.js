import { cachedDb } from '../../db/cachedDb.js'

export const getOrCreateCachedDb = async ({ ctx, timeInSeconds = 0, url }) => {
    const dbUrl = new URL(url)
    const dbCacheKey = new Request(dbUrl.toString())

    if (!url)return console.error('getOrCreateCachedDb is required url')

    if (!timeInSeconds) timeInSeconds = 3600 // 1 hour

    const alreadyCachedDb = cachedDb.get(url)
    if (alreadyCachedDb) {
      console.log('Memory hit for some user')
      return alreadyCachedDb
    }

    const dbCache = caches.default
    let dbCacheResponse = await dbCache.match(dbCacheKey)

    if (!dbCacheResponse) {
      console.log(
        `Response for request url: ${dbCacheKey.url} not present in cache. Fetching and caching request.`
      )
      // If not in cache, get it from origin
      dbCacheResponse = await fetch(dbCacheKey.url)

      // Must use Response constructor to inherit all of response's fields
      dbCacheResponse = new Response(dbCacheResponse.body)

      // Cache API respects Cache-Control headers. Setting s-max-age to 10
      // will limit the response to be in cache for 3600 seconds max (1 hour)
      // Any changes made to the response here will be reflected in the cached value
      dbCacheResponse.headers.append('Cache-Control', `s-maxage=${timeInSeconds}`)
      ctx.waitUntil(dbCache.put(dbCacheKey, dbCacheResponse.clone()))
    } else {
      console.log('Cache hit for some user')
    }
    cachedDb.put(url, await dbCacheResponse.json())
    setTimeout(() => {
      console.log('clear memory cache')
      cachedDb.delete(url)
    }, 1000)

    return cachedDb.get(url)
}
