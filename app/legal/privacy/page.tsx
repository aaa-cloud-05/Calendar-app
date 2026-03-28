import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "プライバシーポリシー",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-2xl px-5 py-10 space-y-6 text-sm leading-relaxed">
        <p>
          <Link href="/" className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900">
            トップに戻る
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">プライバシーポリシー</h1>
        <p className="text-zinc-600">
          本サービスでは、日程調整のために必要な範囲で情報を取り扱います。個別の事業者名・連絡先は、公開前にこのページを実態に合わせて更新してください。
        </p>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">1. 取得する情報</h2>
          <ul className="list-disc space-y-1 pl-5 text-zinc-600">
            <li>主催者が入力したイベント情報（タイトル、日程候補、任意項目など）</li>
            <li>参加者が入力した回答（可否、コメント、表示名など。匿名設定時は名前を保存しない設計にできます）</li>
            <li>ブラウザに保存される識別子（同一ブラウザでの回答更新用のゲストID など）</li>
            <li>アクセスログやエラーログ（ホスティング・インフラ提供者の仕様に依存）</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">2. 利用目的</h2>
          <p className="text-zinc-600">
            日程調整機能の提供、表示・集計、不正利用の防止、品質改善のため利用します。
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">3. 第三者提供・委託</h2>
          <p className="text-zinc-600">
            データベース等のインフラとして Supabase 等のサービスを利用する場合、同社のプライバシーポリシーに従い処理されます。QR コード生成に外部APIを利用する場合、そのサービスに URL が送信されることがあります。
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">4. 保存期間</h2>
          <p className="text-zinc-600">
            運営上の必要な期間保存し、不要となった場合は削除します。具体的な保存期間は運営方針に従い本ページで明示してください。
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-800">5. お問い合わせ</h2>
          <p className="text-zinc-600">
            個人情報の開示・訂正・削除等のご請求は、運営者の連絡先へご連絡ください（連絡先を記載してください）。
          </p>
        </section>
      </main>
    </div>
  )
}
