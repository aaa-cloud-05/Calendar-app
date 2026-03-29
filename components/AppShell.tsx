"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus } from "lucide-react"
import type { ReactNode } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

type AppShellProps = {
  children: ReactNode
}

const menuItems = [
  { href: "/", label: "トップ", icon: Home },
  { href: "/create", label: "作成", icon: Plus },
]

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarHeader className="px-3 py-4">
          <p className="text-sm font-semibold">Quick Plan</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-5 py-4">
            <SidebarTrigger className="size-8" />
            <Link
              href="/"
              className="inline-block text-base font-semibold text-zinc-900 hover:text-zinc-700"
            >
              Quick Plan
            </Link>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
