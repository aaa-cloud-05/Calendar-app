import AnswerTile from "@/components/AnswerTile"

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return (
    <div className="max-w-md mx-auto p-4 py-8">
      <header className="mb-8">
        <h1>{token}</h1>
        <AnswerTile/>
        <AnswerTile/>
        <AnswerTile/>
        <div>Comment Area</div>
        <div>Send Button (CTA)</div>
      </header>
    </div>
  )
}