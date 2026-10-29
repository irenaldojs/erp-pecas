import { localDb, type Peca } from './local'

const LOTE = 500

export async function sincronizarPecas() {
  const meta = await localDb.meta.get('pecas_sync')
  let desde = meta?.valor ?? '1970-01-01T00:00:00.000Z'

  while (true) {
    const res = await fetch(`/api/pecas?updatedSince=${encodeURIComponent(desde)}`)
    if (!res.ok) throw new Error('Falha na sincronização')
    const lote: Peca[] = await res.json()
    if (lote.length === 0) break

    const apagar = lote.filter((p) => p.deletedAt).map((p) => p.id)
    const manter = lote.filter((p) => !p.deletedAt)
    desde = lote[lote.length - 1].updatedAt

    await localDb.transaction('rw', localDb.pecas, localDb.meta, async () => {
      await localDb.pecas.bulkDelete(apagar)
      await localDb.pecas.bulkPut(manter)
      await localDb.meta.put({ chave: 'pecas_sync', valor: desde })
    })

    if (lote.length < LOTE) break
  }
}