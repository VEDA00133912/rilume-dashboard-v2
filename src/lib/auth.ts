import NextAuth, { type DefaultSession } from "next-auth"
import Discord from "next-auth/providers/discord"

const allowedIds = (process.env.ALLOWED_DISCORD_IDS ?? "")
  .split(",")
  .map((s) => s.trim())

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: { scope: "identify email guilds" },
      },
      checks: ["state"],
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.sub ?? ""
      session.accessToken = token.accessToken as string | undefined
      return session
    },
    async signIn({ account }) {
      const discordId = account?.providerAccountId
      if (!discordId || !allowedIds.includes(discordId)) {
        return false
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})