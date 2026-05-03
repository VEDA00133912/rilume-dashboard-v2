import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginButton } from './LoginButton'
import Image from 'next/image'

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <div className="min-h-screen bg-[#0c0d10] flex items-center justify-center relative overflow-hidden">
      {/* 背景 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(88,101,242,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88,101,242,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(88,101,242,0.2) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex gap-0 rounded-2xl overflow-hidden border border-white/10">
        {/* ログイン */}
        <div className="bg-[#0f1015]/95 backdrop-blur-xl p-10 w-80 text-center">
          {/* アイコン */}
          <div className="flex justify-center mb-5">
            <Image
              src="/logo.png"
              alt="logo"
              width={56}
              height={56}
              className="rounded-2xl object-contain"
            />
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
            Rilume
          </h1>

          <p className="text-xs text-white/30 font-mono mb-8 leading-relaxed">
            developer dashboard
            <br />
            Discordアカウントでログイン
          </p>

          <LoginButton />

          <div className="flex items-center gap-2 my-5 text-white/20 text-xs font-mono">
            <div className="flex-1 h-px bg-white/10" />
            scope permissions
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="text-left text-xs font-mono text-white/30 border border-white/8 rounded-lg p-3 leading-relaxed">
            <span className="text-white/50 font-bold">
              付与されるスコープ：
            </span>
            <br />
            identify &nbsp;•&nbsp; email &nbsp;•&nbsp; guilds
          </div>
        </div>

        {/* 右サイド */}
        <div className="w-56 border-l border-white/6 p-7 flex flex-col justify-center bg-[#0f1015]/60">
          <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-5">
            features
          </p>

          {[
            ['サーバー管理', '参加全サーバーを一括管理'],
            ['データベース管理', '設定などを管理'],
            ['ログビューア', 'コマンドの実行ログの確認'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5865f2] mt-1.5" />
              <div>
                <p className="text-xs font-bold text-white/75">{title}</p>
                <p className="text-xs text-white/45">{desc}</p>
              </div>
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-white/5 text-white/15 text-xs font-mono">
            v0.1.0 — alpha build
          </div>
        </div>
      </div>
    </div>
  )
}