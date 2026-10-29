import Dexie, { type EntityTable } from 'dexie'

export interface Peca {
  id: string
  codigo: string
  descricao: string
  marca: string | null
  precoVenda: string
  ativo: boolean
  updatedAt: string
  deletedAt: string | null
}

export const localDb = new Dexie('erp') as Dexie & {
  pecas: EntityTable<Peca, 'id'>
  meta: EntityTable<{ chave: string; valor: string }, 'chave'>
}

localDb.version(1).stores({
  pecas: 'id, codigo, updatedAt',
  meta: 'chave',
})