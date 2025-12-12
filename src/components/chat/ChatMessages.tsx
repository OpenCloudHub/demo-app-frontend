/**
 * @fileoverview Chat messages display component.
 */

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Message } from "@/lib/types";

/** Props for the ChatMessages component */
interface ChatMessagesProps {
  /** Array of messages to display */
  messages: Message[];
  /** Whether a response is currently being streamed */
  isLoading: boolean;
}

/**
 * Displays the chat conversation history with auto-scrolling.
 * Shows a typing indicator when waiting for AI response.
 * Renders human messages on the right, AI messages on the left.
 */
export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const showTypingIndicator =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === "ai" &&
    messages[messages.length - 1]?.content === "";

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-6 max-w-3xl mx-auto">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 mx-auto text-sky-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-200 mb-2">
              OpenCloudHub Assistant
            </h2>
            <p className="text-slate-400">
              Ask me anything about the OpenCloudHub MLOps platform
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          // Skip rendering empty AI message when showing typing indicator
          if (
            showTypingIndicator &&
            i === messages.length - 1 &&
            msg.role === "ai" &&
            msg.content === ""
          ) {
            return null;
          }

          return (
            <div
              key={i}
              className={
                "flex gap-3 " +
                (msg.role === "human" ? "justify-end" : "justify-start")
              }
            >
              {msg.role === "ai" && (
                <Avatar className="h-8 w-8 shrink-0 bg-sky-600">
                  <AvatarFallback className="bg-sky-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={
                  "max-w-[80%] rounded-2xl px-4 py-3 " +
                  (msg.role === "human"
                    ? "bg-sky-600 text-white"
                    : "bg-slate-700 text-slate-100")
                }
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>

              {msg.role === "human" && (
                <Avatar className="h-8 w-8 shrink-0 bg-slate-600">
                  <AvatarFallback className="bg-slate-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}

        {showTypingIndicator && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8 shrink-0 bg-sky-600">
              <AvatarFallback className="bg-sky-600 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-slate-700 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
