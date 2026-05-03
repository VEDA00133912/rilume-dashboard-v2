import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { Expand } from '@/types/db'

async function getCol() {
  const client = await clientPromise
  return client.db().collection<Expand>('expands')
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const col = await getCol()
  const data = await col.find().toArray()
  return Response.json(data)
}