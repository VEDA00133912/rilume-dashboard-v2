import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { Impersonate } from '@/types/db'
import { NextRequest } from 'next/server'

async function getCol() {
  const client = await clientPromise
  return client.db().collection<Impersonate>('impersonates')
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { guildId } = await params
  const body = await req.json()

  const col = await getCol()
  const doc = await col.findOneAndUpdate(
    { guildId },
    { $set: body },
    { returnDocument: 'after' }
  )

  return Response.json(doc)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { guildId } = await params

  const col = await getCol()
  await col.deleteOne({ guildId })

  return Response.json({ success: true })
}