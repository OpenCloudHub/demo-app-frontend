/**
 * @fileoverview Utility functions for the application.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 *
 * Combines multiple class values and intelligently merges Tailwind CSS classes,
 * resolving conflicts (e.g., `bg-red-500 bg-blue-500` → `bg-blue-500`).
 *
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns Merged class name string
 *
 * @example
 * cn("px-2 py-1", "bg-red-500", { "opacity-50": isDisabled })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
