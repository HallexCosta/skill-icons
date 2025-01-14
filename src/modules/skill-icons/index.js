import * as icons from '../../../dist/icons.json'
import { response } from './workers/response'

import { cachedDb } from './db/cachedDb'
import { generatorService } from './services/generatorSvgService'
import { validateRequestIconsCorrectFormat } from './utils/validateRequestIconsCorrectFormat'

const ICONS_PER_LINE = 15

async function handleRequest(request, env, ctx) {
  const { pathname, searchParams } = new URL(request.url)

  const path = pathname.replace(/^\/|\/$/g, '')

  if (path === '') {
    return response.json(
      {
        message: 'I`m alive'
      },
      { status: 200 }
    )
  }

  if (path === 'icons') {
    const iconParam = searchParams.get('i') || searchParams.get('icons')
    if (!iconParam) {
      return response.json(
        {
          message: "You didn't specify any icons!"
        },
        {
          status: 400
        }
      )
    }
    const theme = searchParams.get('t') || searchParams.get('theme')
    if (theme && theme !== 'dark' && theme !== 'light') {
      return response.json(
        {
          message: 'Theme must be either "light" or "dark"'
        },
        {
          status: 400
        }
      )
    }
    const perLine = searchParams.get('perline') || ICONS_PER_LINE
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    if (isNaN(perLine) || perLine < -1 || perLine > 50)
      return response.json(
        {
          message: 'Icons per line must be a number between 1 and 50'
        },
        {
          status: 400
        }
      )

    const requestIcons = iconParam.split(',')

    const iconNames = validateRequestIconsCorrectFormat(requestIcons)
    if (!iconNames) {
      return response.json(
        {
          message: "You didn't format the icons param correctly!"
        },
        {
          status: 400
        }
      )
    }

    const dbUrl = new URL(env.DB_URL)
    const dbCacheKey = new Request(dbUrl.toString())

    const dbCache = caches.default
    let dbCacheResponse = await dbCache.match(dbCacheKey)

    if (!dbCacheResponse) {
      console.log(
        `Response for request url: ${dbCacheKey.url} not present in cache. Fetching and caching request.`
      )
      // If not in cache, get it from origin
      dbCacheResponse = await fetch(dbCacheKey.url)
      // console.log('before getAlias', await dbCacheResponse.text())
      // Must use Response constructor to inherit all of response's fields
      dbCacheResponse = new Response(dbCacheResponse.body, response)
      // Cache API respects Cache-Control headers. Setting s-max-age to 10
      // will limit the response to be in cache for 3600 seconds max (1 hour)
      // Any changes made to the response here will be reflected in the cached value
      dbCacheResponse.headers.append('Cache-Control', 's-maxage=3600')
      ctx.waitUntil(dbCache.put(dbCacheKey, dbCacheResponse.clone()))
    } else {
      cachedDb.put(await dbCacheResponse.json())
      console.log('Cache hit for some user')
    }

    const svg = await generatorService.svg(requestIcons, perLine)
    return response.svg(svg)
  }

  if (path === 'api/icons') {
    return response.json(iconNameList)
  }

  if (path === 'api/svgs') {
    return response.json(icons)
  }

  return fetch(request)
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  }
}
