import { clsx } from "clsx"; // Utility for constructing className strings conditionally
import { twMerge } from "tailwind-merge"; // Utility for merging Tailwind CSS classes intelligently

/**
 * Combines multiple CSS class names into a single string,
 * handling conditional classes and merging Tailwind CSS classes efficiently.
 * This is a common utility in projects using Tailwind CSS and Shadcn UI.
 *
 * @param {...(string | string[] | Record<string, boolean> | null | undefined)} inputs -
 * A variable number of arguments, which can be:
 * - Strings: Directly added to the class list.
 * - Arrays of strings: Each string in the array is added.
 * - Objects: Keys are added as class names if their corresponding value is truthy.
 * - null/undefined: Ignored.
 * @returns {string} A single string containing merged and optimized CSS class names.
 */
export function cn(...inputs) {
  // clsx handles conditional class names and arrays.
  // twMerge intelligently merges Tailwind classes, resolving conflicts
  // (e.g., `p-4` and `p-6` will result in `p-6`).
  return twMerge(clsx(inputs));
}
