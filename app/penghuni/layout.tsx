"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/storage"
import { PenghuniSidebar } from "@/components/penghuni-sidebar"

export default function PenghuniLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "penghuni") {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex h-screen bg-background">
      <PenghuniSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
