import { notFound } from "next/navigation"
import InvitationHeroCard from "@/components/HeroCard"
import { getInvitationDraft, getInvitationResponses } from "./actions"
import Link from "next/link"

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  
  const invitation = await getInvitationDraft(token)

  if (!invitation) {
    return notFound()
  }

  const responses = await getInvitationResponses(invitation.id)

  return (
    <div className="max-w-md mx-auto p-4">
      <InvitationHeroCard
        draft={invitation}
        participants={[]}
      />

      <div>
        <h1>Response Status</h1>
        <div></div>
        <div>{responses.length}</div>
      </div>
      
      <Link href={`/answer/${token}`}>Answer Button (CTA)</Link>
    </div>
  )
}