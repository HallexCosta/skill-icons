import { defineRoutes } from './routes/routes'

async function handleRequest(
  request: Request<unknown, IncomingRequestCfProperties<unknown>>,
  env: Env,
  ctx: ExecutionContext
) {
  // const alreadyCachedRequest = await cachedRequest.get(request)

  // if (alreadyCachedRequest) {
  //   console.log('Cache hit for', request.url)
  //   return alreadyCachedRequest
  // }

  return defineRoutes({
    ctx,
    env,
    request
  })
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  }
} satisfies ExportedHandler<Env>
