import AnswerTile from "@/components/AnswerTile"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return (
    <div className="max-w-md mx-auto p-4 py-8">
        <h1>{token}</h1>
        <AnswerTile/>
        <AnswerTile/>
        <AnswerTile/>
        <Textarea/>
        <Button>Send Answer</Button>
    </div>
  )
}