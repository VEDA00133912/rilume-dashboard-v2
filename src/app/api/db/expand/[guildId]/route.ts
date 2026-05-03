import { auth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import type { Expand } from "@/types/db"

type Params = { params: { guildId: string } }

async function getCol() {
  const client = await clientPromise
  return client.db().collection<Expand>("expands")
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { expand } = await req.json()
  const col = await getCol()
  const doc = await col.findOneAndUpdate(
    { guildId: params.guildId },
    { $set: { expand } },
    { returnDocument: "after" }
  )

  return Response.json(doc)
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const col = await getCol()
  await col.deleteOne({ guildId: params.guildId })
  return Response.json({ success: true })
}