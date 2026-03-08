"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ShareCard from "@/components/ShareCard"

type InvitationShareDialogProps = {
  token: string
  defaultOpen?: boolean
}

const InvitationShareDialog = ({ token, defaultOpen = false }: InvitationShareDialogProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const answerUrl = `/answer/${token}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>共有</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>招待カードシェア</DialogTitle>
          <DialogDescription>
            招待リンクとトークンを共有できます。
          </DialogDescription>
        </DialogHeader>

        <ShareCard token={token} answerUrl={answerUrl} />
      </DialogContent>
    </Dialog>
  )
}

export default InvitationShareDialog