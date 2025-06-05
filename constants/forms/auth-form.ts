export const AUTH_FORM = {
  FIELDS: {
    EMAIL: {
      NAME: "email",
      LABEL: "Email Address",
      PLACEHOLDER: "Enter your email address",
      TYPE: "email",
    },
    PASSWORD: {
      NAME: "password",
      LABEL: "Password",
      PLACEHOLDER: "Enter your password",
      TYPE: "password",
    },
    CONFIRM_PASSWORD: {
      NAME: "confirmPassword",
      LABEL: "Confirm Password",
      PLACEHOLDER: "Confirm your password",
      TYPE: "password",
    },
    NAME: {
      NAME: "name",
      LABEL: "Full Name",
      PLACEHOLDER: "Enter your full name",
      TYPE: "text",
    },
  },
  BUTTONS: {
    LOGIN: "Sign In",
    REGISTER: "Create Account",
    LOADING: "Please wait...",
    TOGGLE_LOGIN: "Already have an account? Sign in",
    TOGGLE_REGISTER: "Don't have an account? Sign up",
  },
  VALIDATION: {
    EMAIL_REQUIRED: "Email address is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
    NAME_REQUIRED: "Full name is required",
    PASSWORDS_DONT_MATCH: "Passwords do not match",
  },
} as const
