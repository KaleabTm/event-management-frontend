"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authSchema, type AuthFormData } from "@/lib/validations/event"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      action: isLogin ? "login" : "register",
    },
  })

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        name: data.name,
        action: data.action,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    reset({
      email: "",
      password: "",
      name: "",
      action: !isLogin ? "login" : "register",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Create Account"}</CardTitle>
        <CardDescription>
          {isLogin ? "Enter your credentials to access your events" : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} className={errors.name ? "border-red-500" : ""} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <input type="hidden" {...register("action")} value={isLogin ? "login" : "register"} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" onClick={toggleMode}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
