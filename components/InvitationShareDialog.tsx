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
import { QrCode } from "lucide-react"

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
        <Button variant="outline" className="size-11 rounded-full border border-gray-300 hover:bg-gray-50" size="icon">
            <QrCode className="size-4" />
          </Button>
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