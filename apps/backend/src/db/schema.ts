import { pgTable, uuid, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core'

export const pecas = pgTable('pecas', {
  id: uuid('id').defaultRandom().primaryKey(),
  codigo: text('codigo').notNull().unique(),
  descricao: text('descricao').notNull(),
  marca: text('marca'),
  precoVenda: numeric('preco_venda', { precision: 12, scale: 2 }).notNull().default('0'),
  ativo: boolean('ativo').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})