import * as icons from '../../../dist/icons.json'
import { response } from './workers/response.js'
import { getOrCreateCachedDb } from './workers/cache/getOrCreateCachedDb.js'

import { generatorService } from './services/generatorSvgService'
import { validateRequestIconsCorrectFormat } from './common/validateRequestIconsCorrectFormat'

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

    const memoryCachedDb = await getOrCreateCachedDb({
      ctx,
      url: env.DB_URL,
      timeInSeconds: 60 * 60 * 1000
    })

    const svg = await generatorService.svg(memoryCachedDb, requestIcons, perLine)
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
