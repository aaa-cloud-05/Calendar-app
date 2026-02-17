import AnswerTile from "@/components/AnswerTile"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabaseServer } from "@/lib/supabase/server"

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const supabase = await supabaseServer();
  const { data: invitation, error} = await supabase
    .from("invitations")
    .select("*")
    .eq("invite_token", token)
    .single()

  return (
    <div className="max-w-md mx-auto p-4 py-8">
      <h1>{token}</h1>
      {/* name */}
      <Textarea/>
      
      <AnswerTile/>
      <AnswerTile/>
      <AnswerTile/>
      
      {/* comment */}
      <Textarea/>

      <Button>Send Answer</Button>
      
      <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(invitation, null, 2)}
      </pre>
    </div>
  )
}