"use client"

import type React from "react"
import MainNavbar from "../navigations/main-navbar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      <main className="container mx-auto py-6">{children}</main>
    </div>
  )
}
