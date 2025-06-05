export interface User {
  id: string
  email: string
  name: string
}

export interface AuthFormData {
  email: string
  password: string
  name?: string
  action: "login" | "register"
}
