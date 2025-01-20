import { cacheNames } from './caches'

async function get(request: Request) {
  const cache = await caches.open(cacheNames.CACHE_REQUEST_NAME)
  return await cache.match(request)
}

async function put(request: Request, response: Response) {
  const cache = await caches.open(cacheNames.CACHE_REQUEST_NAME)
  return cache.put(request, response.clone())
}

export const cachedRequest = {
  get,
  put
}
