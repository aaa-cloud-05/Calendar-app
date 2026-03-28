import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "利用規約",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-2xl px-5 py-10 space-y-6 text-sm leading-relaxed">
        <p>
          <Link href="/" className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900">
            トップに戻る
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">利用規約</h1>
        <p className="text-zinc-600">
          本サービス（以下「本サービス」）をご利用いただく前に、以下をお読みください。本サービスを利用された場合、これらに同意したものとみなします。
        </p>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">1. サービス内容</h2>
          <p className="text-zinc-600">
            本サービスは、イベント等の日程候補の共有と参加者からの回答収集を目的とした機能を提供します。機能内容は予告なく変更される場合があります。
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">2. 利用上の注意</h2>
          <p className="text-zinc-600">
            招待リンク・トークンを知る者は招待内容や回答にアクセスできる可能性があります。リンクの取り扱いにご注意ください。法令違反、他人への迷惑、権利侵害などを目的とした利用は禁止します。
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">3. 免責事項</h2>
          <p className="text-zinc-600">
            本サービスは現状有姿で提供されます。本サービスの利用により生じた損害について、当社（または運営者）の故意または重過失による場合を除き、責任を負わないものとします。
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">4. 規約の変更</h2>
          <p className="text-zinc-600">
            本規約は必要に応じて改定されます。改定後の利用により、改定後の規約に同意したものとみなします。
          </p>
        </section>
      </main>
    </div>
  )
}
