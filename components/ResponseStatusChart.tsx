"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type Props = {
  data: {
    date: string
    yes: number
    maybe: number
    no: number
  }[]
}

const chartConfig = {
  yes: {
    label: "Yes",
    color: "#22c55e",
  },
  maybe: {
    label: "Maybe",
    color: "#f59e0b",
  },
  no: {
    label: "No",
    color: "#ef4444",
  },
} satisfies ChartConfig

export default function ResponseStatusChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="yes" stackId="availability" fill="var(--color-yes)" radius={[0, 0, 4, 4]} />
        <Bar dataKey="maybe" stackId="availability" fill="var(--color-maybe)" />
        <Bar dataKey="no" stackId="availability" fill="var(--color-no)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}