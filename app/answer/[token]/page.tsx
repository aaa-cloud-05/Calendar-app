export default async function AnswerPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const invitation = await getInvitationByToken(token)

  // if (!invitation) return notFound()

  return (
    <div className="max-w-md mx-auto p-4 py-8">
      <header className="mb-8">
        {/* <h1 className="text-2xl font-bold mb-2">{invitation.title}</h1> */}
        <p className="text-muted-foreground text-sm">
          回答を入力
        </p>
      </header>
      
      <AnswerPage invitation={invitation} token={token} />
    </div>
  )
}