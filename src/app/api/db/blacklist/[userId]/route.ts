import { auth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import type { BlacklistUser } from "@/types/db"

type Params = { params: { userId: string } }

async function getCol() {
  const client = await clientPromise
  return client.db().collection<BlacklistUser>("blacklistusers")
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const col = await getCol()
  await col.deleteOne({ userId: params.userId })
  return Response.json({ success: true })
}