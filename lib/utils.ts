import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function getInitials(name: string) {
  return name
    .split(" ") // Split the name by spaces
    .map((word) => word[0]) // Take the first letter of each word
    .join("") // Join them to form the initials
    .toUpperCase(); // Convert to uppercase
}

export function getAcronym(phrase: string): string {
  const excludeWords = ["of", "in", "and"]; // Add common words to exclude from acronym
  return phrase
    .split(" ") // Split phrase into words
    .filter((word) => !excludeWords.includes(word.toLowerCase())) // Exclude common words
    .map((word) => word[0].toUpperCase()) // Get the first letter of each word
    .join(""); // Join the letters into the acronym
}

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-PH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
