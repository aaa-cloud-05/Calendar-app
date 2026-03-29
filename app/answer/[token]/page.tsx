import AnswerScreen from "@/components/AnswerScreen"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabaseService } from "@/lib/supabase/service"
import Link from "next/link";

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const supabase = supabaseService();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("invite_token", token)
    .single()
  
  if (!invitation) {
    return (
      <div className="max-w-md mx-auto p-4 py-10">
        <Card className="p-6 text-center space-y-3">
          <h1 className="text-lg font-semibold text-zinc-900">招待が見つかりませんでした</h1>
          <p className="text-sm text-zinc-600">
            URLが誤っているか、招待が削除されている可能性があります。
          </p>
          <Button asChild className="mt-2">
            <Link href="/">トップに戻る</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const isDeadlinePassed = invitation.settings?.deadline
    ? new Date(invitation.settings.deadline) < new Date()
    : false


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-md px-4">
        <AnswerScreen invitation={invitation} initialDeadlinePassed={isDeadlinePassed} />
      </div>

      {/* <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(invitation, null, 2)}
      </pre> */}
    </div>
  )
}