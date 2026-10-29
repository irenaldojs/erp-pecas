import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { and, eq, gt, ilike, isNull, or } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { pecas } from '../../db/schema.js'

const novaPeca = z.object({
  codigo: z.string().min(1),
  descricao: z.string().min(1),
  marca: z.string().optional(),
  precoVenda: z.string().regex(/^\d+(\.\d{1,2})?$/),
})

export async function catalogoRoutes(app: FastifyInstance) {
  // busca: /pecas?q=filtro  |  sync: /pecas?updatedSince=2026-10-29T00:00:00Z
  app.get('/pecas', async (req) => {
    const { q, updatedSince } = z
      .object({ q: z.string().optional(), updatedSince: z.coerce.date().optional() })
      .parse(req.query)

    return db
      .select()
      .from(pecas)
      .where(
        and(
          updatedSince ? gt(pecas.updatedAt, updatedSince) : isNull(pecas.deletedAt),
          q ? or(ilike(pecas.codigo, `%${q}%`), ilike(pecas.descricao, `%${q}%`)) : undefined,
        ),
      )
      .limit(100)
  })

  app.post('/pecas', async (req, reply) => {
    const dados = novaPeca.parse(req.body)
    const [criada] = await db.insert(pecas).values(dados).returning()
    return reply.code(201).send(criada)
  })

  app.delete('/pecas/:id', async (req) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params)
    await db.update(pecas).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(pecas.id, id))
    return { ok: true }
  })
}