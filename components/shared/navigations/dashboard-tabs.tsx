"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List } from "lucide-react"
import { DASHBOARD_PAGE } from "@/constants/pages/dashboard-page"

interface DashboardTabsProps {
  children: React.ReactNode
  defaultValue?: string
}

export default function DashboardTabs({ children, defaultValue = "calendar" }: DashboardTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="calendar" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {DASHBOARD_PAGE.SECTIONS.TABS.CALENDAR}
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center">
          <List className="h-4 w-4 mr-2" />
          {DASHBOARD_PAGE.SECTIONS.TABS.LIST}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
