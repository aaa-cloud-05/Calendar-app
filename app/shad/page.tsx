import { Calendar16 } from "@/components/calendar-05"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const page = () => {
  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="email">タイトル</Label>
        <Input type="text" id="" placeholder="忘年会" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="email">メモ</Label>
        <Input type="text" id="" placeholder="Hello world" />
      </div>
      <Calendar16 />
      <Button>決定</Button>
    </div>
  )
}

export default page