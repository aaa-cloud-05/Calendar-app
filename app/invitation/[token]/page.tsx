import { notFound } from "next/navigation"
import InvitationHeroCard from "@/components/HeroCard"
import { getInvitationDraft } from "./actions"
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

  return (
    <div className="max-w-md mx-auto p-4">
      <InvitationHeroCard
        draft={invitation}
        participants={[]}
      />
      <Link href={`/answer/${token}`}>Click to answer</Link>
    </div>
  )
}