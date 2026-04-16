import type { PasswordRequirement } from "./secure-password-creation-input-types";

export const defaultPasswordRequirements: PasswordRequirement[] = [
  {
    id: "min-length-8",
    label: "At least 8 characters",
    validate: (password: string): boolean => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    validate: (password: string): boolean => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    validate: (password: string): boolean => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "At least one number",
    validate: (password: string): boolean => /\d/.test(password),
  },
  {
    id: "special",
    label: "At least one special character",
    validate: (password: string): boolean =>
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  },
];
