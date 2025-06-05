"use client"

import type React from "react"
import { QueryProvider } from "./query-provider"
import { SessionProvider } from "./session-provider"
import { ThemeProvider } from "./theme-provider"
import { ToastProvider } from "./toast-provider"
import { EventProvider } from "./event-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <SessionProvider>
          <EventProvider>
            {children}
            <ToastProvider />
          </EventProvider>
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
