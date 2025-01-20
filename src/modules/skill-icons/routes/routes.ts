import { type } from 'arktype'
import * as icons from '../../../../dist/icons.json'
import { cachedDb } from '../db/cachedDb'
import { iconProvider } from '../providers/iconProvider'
import { iconService } from '../services/iconService'
import { svgProcessorService } from '../services/svgProcessorService'
import { requestIconsValidator } from '../validations/requestIconsValidator'
import { cachedRequest } from '../workers/cache/cachedRequest'
import { cacheNames } from '../workers/cache/caches'
import { response } from '../workers/response'
import { routes } from './core/routes'

interface DefineRoutesParams {
  request: Request<unknown, IncomingRequestCfProperties<unknown>>
  env: Env
  ctx: ExecutionContext
}

export async function defineRoutes({ request, env, ctx }: DefineRoutesParams) {
  routes.defaultResponse(() => fetch(request))

  routes.get('/', async () =>
    response.json(
      {
        message: 'I`m alive'
      },
      { status: 200 }
    )
  )

  routes.get('/icons', async ({ request }) => {
    const ICONS_PER_LINE = 15

    const { error, result } = requestIconsValidator.validateQueryParams<{
      requestIcons: string
      perLine: number
    }>(request, ICONS_PER_LINE)

    if (error) {
      return result
    }

    if (!requestIconsValidator.validateMatchPattern(result.requestIcons)) {
      return response.json(
        {
          message: "You didn't format the icons param correctly!"
        },
        {
          status: 400
        }
      )
    }

    const timeInSeconds = 60 * 60 * 1 // 1 hour
    const { error: gerOrCreateCachedDbErr, data: cachedDbData } =
      await iconService.getOrCreateCachedDb({
        url: env.DB_URL,
        timeInSeconds
      })

    if (gerOrCreateCachedDbErr)
      return response.json({ message: gerOrCreateCachedDbErr })

    if (cachedDbData instanceof Promise) {
      ctx.waitUntil(cachedDbData)
      ctx.waitUntil(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(cachedDb.delete(env.DB_URL))
          }, timeInSeconds)
        })
      )
    }

    const svg = await svgProcessorService.generate(
      result.requestIcons.split(','),
      result.perLine
    )
    const svgsResult = response.svg(svg)
    svgsResult.headers.append(
      'Cache-Control',
      `s-maxage=${timeInSeconds * 4 /*4 hours*/}`
    )
    ctx.waitUntil(cachedRequest.put(request, svgsResult))
    return svgsResult
  })

  routes.get('/api/icons/caches/clear', async ({ env, ctx }) => {
    const dbCache = await caches.open(cacheNames.CACHED_DB_NAME)
    const clear = await dbCache.delete(new Request(new URL(env.DB_URL)))
    cachedDb.clear()
    return response.json({
      clear
    })
  })

  routes.get('/api/icons', async () => {
    return response.json(await iconProvider.fetchSkillIconsDb(env.DB_URL))
  })

  routes.get('/api/svgs', async () => {
    return response.json(icons)
  })

  return await routes.notify({
    ctx,
    env,
    request
  })
}
