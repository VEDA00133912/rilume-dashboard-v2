import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { ImpersonateLog } from '@/types/db'

async function getCol() {
  const client = await clientPromise
  return client.db().collection<ImpersonateLog>('impersonatelogs')
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const guildId = searchParams.get('guildId')

  const col = await getCol()
  const data = await col
    .find(guildId ? { guildId } : {})
    .sort({ executedAt: -1 })
    .limit(100)
    .toArray()

  return Response.json(data)
}