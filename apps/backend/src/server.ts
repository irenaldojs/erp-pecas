import Fastify from 'fastify'
import cors from '@fastify/cors'

import { catalogoRoutes } from './modules/catalogo/routes.js'
// depois do cors:

const app = Fastify({ logger: true })
await app.register(cors, { origin: true })
await app.register(catalogoRoutes)

app.get('/health', async () => ({ ok: true }))

await app.listen({ port: 3000, host: '0.0.0.0' })