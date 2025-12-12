/**
 * @fileoverview Chat input component for user message entry.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

/** Props for the ChatInput component */
interface ChatInputProps {
  /** Callback when a message is submitted */
  onSend: (message: string) => void;
  /** Whether the input should be disabled (e.g., during loading) */
  disabled: boolean;
}

/**
 * Text input component for composing and sending chat messages.
 * Includes a text field and send button with keyboard support (Enter to send).
 */
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  }

  return (
    <div className="p-4 border-t border-slate-700">
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={disabled}
          className="flex-1 bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500"
        />
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
