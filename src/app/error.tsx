/**
 * @fileoverview Global error boundary component.
 *
 * This component catches unhandled errors in the application and
 * displays a user-friendly error message with a retry button.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */

"use client";

/**
 * Error boundary component for handling runtime errors.
 *
 * @param props.reset - Function to attempt recovery by re-rendering the segment
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
