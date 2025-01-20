import { response } from '../../workers/response'

interface Handler {
  request: Request
  env: Env
  ctx: ExecutionContext
}

const _routes = new Map()

const middlewareEnsureGetRequest = (request: Request) => {
  if (request.method.toLowerCase() === 'get') return true

  return false
}
const middlewareEnsurePostRequest = (request: Request) => {
  if (request.method.toLowerCase() === 'post') return true

  return false
}

const get = (
  endpoint: string,
  callback: (params: Handler) => Promise<Response>
) => {
  _routes.set(endpoint, async ({ request, ctx, env }: Handler) => {
    if (!middlewareEnsureGetRequest(request)) {
      const { pathname } = new URL(request.url)
      return response.json({
        message: `GET "${pathname}" Endpoint not implemented`
      })
    }

    return await callback({
      request,
      ctx,
      env
    })
  })
  return
}

const post = (
  endpoint: string,
  callback: (params: Handler) => Promise<Response>
) => {
  _routes.set(endpoint, async ({ request, ctx, env }: Handler) => {
    if (!middlewareEnsurePostRequest(request)) {
      const { pathname } = new URL(request.url)
      return response.json({
        message: `POST "${pathname}" Endpoint not implemented`
      })
    }
    return await callback({
      request,
      ctx,
      env
    })
  })
  return
}

const notify = async ({ request, ctx, env }: Handler) => {
  let result = null
  const url = new URL(request.url)
  for (const [memoryEndpoint, callback] of _routes) {
    if (url.pathname === memoryEndpoint) {
      result = await callback({
        request,
        ctx,
        env
      })
      break
    }
  }
  if (result) return result

  return _routes.get('#')()
}

const defaultResponse = (
  callback: ({ request }: Handler) => Promise<Response>
) => {
  _routes.set('#', async ({ request, ctx, env }: Handler) => {
    return await callback({ request, ctx, env })
  })
  return
}

export const routes = {
  get,
  post,
  notify,
  defaultResponse
}
