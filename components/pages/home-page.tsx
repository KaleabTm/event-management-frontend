"use client";

import AuthForm from "@/components/forms/auth-form";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Event Manager
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Manage your events with ease
					</p>
				</div>
				<AuthForm />
			</div>
		</div>
	);
}
