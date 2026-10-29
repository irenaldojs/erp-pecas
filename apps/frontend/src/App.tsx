import { useState } from 'react'
import { Badge, Group, Stack, Table, TextInput, Title } from '@mantine/core'
import { useDebouncedValue, useNetwork } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useLiveQuery } from 'dexie-react-hooks'
import { localDb } from './db/local'
import { sincronizarPecas } from './db/sync'

export default function App() {
  const [termo, setTermo] = useState('')
  const [busca] = useDebouncedValue(termo, 200)
  const { online } = useNetwork()

  const sync = useQuery({
    queryKey: ['sync-pecas'],
    queryFn: sincronizarPecas,
    refetchInterval: 60_000,
    refetchOnReconnect: true,
    retry: false,
  })

  const pecas = useLiveQuery(async () => {
    const t = busca.trim().toLowerCase()
    if (!t) return localDb.pecas.orderBy('codigo').limit(50).toArray()
    return localDb.pecas
      .filter((p) => p.codigo.toLowerCase().includes(t) || p.descricao.toLowerCase().includes(t))
      .limit(50)
      .toArray()
  }, [busca])

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={3}>Catálogo de peças</Title>
        <Group gap="xs">
          <Badge color={online ? 'green' : 'gray'}>{online ? 'Online' : 'Offline'}</Badge>
          {sync.isFetching && <Badge color="blue">Sincronizando…</Badge>}
          {sync.isError && <Badge color="red">Sync falhou</Badge>}
        </Group>
      </Group>

      <TextInput
        placeholder="Buscar por código ou descrição"
        value={termo}
        onChange={(e) => setTermo(e.currentTarget.value)}
        autoFocus
      />

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Código</Table.Th>
            <Table.Th>Descrição</Table.Th>
            <Table.Th>Marca</Table.Th>
            <Table.Th ta="right">Preço</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pecas?.map((p) => (
            <Table.Tr key={p.id}>
              <Table.Td>{p.codigo}</Table.Td>
              <Table.Td>{p.descricao}</Table.Td>
              <Table.Td>{p.marca}</Table.Td>
              <Table.Td ta="right">
                {Number(p.precoVenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  )
}