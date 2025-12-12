/**
 * @fileoverview Chat sidebar component for session management.
 */

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { ChatSession } from "@/lib/types";

/** Props for the ChatSidebar component */
interface ChatSidebarProps {
  /** Whether the sidebar sheet is open */
  open: boolean;
  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void;
  /** Array of chat sessions to display */
  chats: ChatSession[];
  /** ID of the currently active chat */
  activeChat: string | null;
  /** Callback to create a new chat session */
  onNewChat: () => void;
  /** Callback when a chat is selected */
  onSelectChat: (id: string) => void;
  /** Callback when a chat is deleted */
  onDeleteChat: (id: string) => void;
}

/**
 * Slide-out sidebar for managing chat sessions.
 * Displays chat history and allows creating/deleting sessions.
 */
export function ChatSidebar({
  open,
  onOpenChange,
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-72 bg-slate-900 border-slate-700 p-0"
      >
        <SheetHeader className="p-4 border-b border-slate-700">
          <SheetTitle className="text-slate-100 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-sky-400" />
            Chat History
          </SheetTitle>
        </SheetHeader>

        <div className="p-2">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-sky-600 hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={
                  "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors " +
                  (chat.id === activeChat
                    ? "bg-slate-700 text-slate-100"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200")
                }
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate text-sm">{chat.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
