import AnswerScreen from "@/components/AnswerScreen"
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
  
  if (!invitation) {
    return <div>Not found</div>
  }

  return (
    <div className="max-w-md mx-auto p-4 py-8">
      <h1>{token}</h1>
      <AnswerScreen invitation={invitation}/>
      <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(invitation, null, 2)}
      </pre>
    </div>
  )
}