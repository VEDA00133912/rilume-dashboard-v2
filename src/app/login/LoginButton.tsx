'use client'

import { signIn } from 'next-auth/react'

export function LoginButton() {
  return (
    <button
      onClick={() => signIn('discord')}
      className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm transition-all hover:-translate-y-0.5"
    >
      Discordでログイン
    </button>
  )
}