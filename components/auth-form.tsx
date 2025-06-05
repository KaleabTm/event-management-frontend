"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authSchema } from "@/lib/validations/event"
import { useLogin, useRegister } from "@/actions/query/auth"
import { PAGES } from "@/constants/pages"
import { FORM_LABELS, FORM_PLACEHOLDERS, BUTTON_LABELS } from "@/constants/forms"
import type { AuthFormData } from "@/types/auth"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const loginMutation = useLogin()
  const registerMutation = useRegister()

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
    try {
      if (isLogin) {
        await loginMutation.mutateAsync(data)
      } else {
        await registerMutation.mutateAsync(data)
      }
      router.push(PAGES.DASHBOARD)
    } catch (error) {
      console.error("Auth error:", error)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    reset({
      email: "",
      password: "",
      name: "",
      action: !isLogin ? "login" : "register",
    })
  }

  const isLoading = loginMutation.isPending || registerMutation.isPending
  const error = loginMutation.error || registerMutation.error

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? BUTTON_LABELS.LOGIN : BUTTON_LABELS.REGISTER}</CardTitle>
        <CardDescription>
          {isLogin ? "Enter your credentials to access your events" : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{FORM_LABELS.EMAIL}</Label>
            <Input
              id="email"
              type="email"
              placeholder={FORM_PLACEHOLDERS.EMAIL}
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">{FORM_LABELS.NAME}</Label>
              <Input
                id="name"
                type="text"
                placeholder={FORM_PLACEHOLDERS.NAME}
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">{FORM_LABELS.PASSWORD}</Label>
            <Input
              id="password"
              type="password"
              placeholder={FORM_PLACEHOLDERS.PASSWORD}
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <input type="hidden" {...register("action")} value={isLogin ? "login" : "register"} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? BUTTON_LABELS.LOADING : isLogin ? BUTTON_LABELS.LOGIN : BUTTON_LABELS.REGISTER}
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
