"use client";

import type React from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";
import { EventProvider } from "./event-provider";

interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<QueryProvider>
				<EventProvider>
					{children}
					<ToastProvider />
				</EventProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}
