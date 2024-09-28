import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = "Something went wrong"
) => {
  console.error(error);
  let errorMessage = defaultMessage;
  if (error instanceof Error && error.message.length < 100) {
    errorMessage = error.message;
  }
  return errorMessage;
};

export const maskEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart =
    localPart.length > 3
      ? `${"*".repeat(localPart.length - 3)}${localPart.slice(-3)}`
      : localPart;
  return `${maskedLocalPart}@${domain}`;
};
