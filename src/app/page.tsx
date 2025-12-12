/**
 * @fileoverview Main chat application page component.
 *
 * This is the primary page of the demo-app-frontend, providing a chat
 * interface for interacting with the GenAI backend RAG system.
 *
 * Features:
 * - Session management (create, switch, delete)
 * - Real-time streaming responses via SSE
 * - Responsive design with collapsible sidebar
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChatHeader,
  ChatSidebar,
  ChatMessages,
  ChatInput,
} from "@/components/chat";
import { ChatSession } from "@/lib/types";
import { createSession, deleteSession, streamQuery } from "@/lib/api";

/**
 * Main Chat page component.
 *
 * Manages chat sessions and handles communication with the backend.
 * Initializes a default session on mount and supports multiple concurrent sessions.
 */
export default function Chat() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize first session
  useEffect(() => {
    async function init() {
      try {
        const session = await createSession();
        const newChat: ChatSession = {
          id: session.session_id,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
        };
        setChats([newChat]);
        setActiveChat(session.session_id);
      } catch (err) {
        setError("Failed to connect to backend");
        console.error(err);
      }
    }
    init();
  }, []);

  const currentChat = chats.find((c) => c.id === activeChat);
  const messages = currentChat?.messages || [];

  async function handleNewChat() {
    try {
      const session = await createSession();
      const newChat: ChatSession = {
        id: session.session_id,
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(session.session_id);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  }

  async function handleDeleteChat(chatId: string) {
    try {
      await deleteSession(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));

      if (activeChat === chatId) {
        const remaining = chats.filter((c) => c.id !== chatId);
        if (remaining.length > 0) {
          setActiveChat(remaining[0].id);
        } else {
          // Create new session if all deleted
          const session = await createSession();
          const newChat: ChatSession = {
            id: session.session_id,
            title: "New Chat",
            messages: [],
            createdAt: new Date(),
          };
          setChats([newChat]);
          setActiveChat(session.session_id);
        }
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  }

  function handleSelectChat(chatId: string) {
    setActiveChat(chatId);
    setSidebarOpen(false);
  }

  async function handleSendMessage(question: string) {
    if (!activeChat || isLoading) return;

    // Add user message and empty AI message
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChat) return chat;
        return {
          ...chat,
          title:
            chat.messages.length === 0
              ? question.slice(0, 30) + (question.length > 30 ? "..." : "")
              : chat.title,
          messages: [
            ...chat.messages,
            { role: "human" as const, content: question },
            { role: "ai" as const, content: "" },
          ],
        };
      })
    );

    setIsLoading(true);

    try {
      await streamQuery(
        question,
        activeChat,
        (token) => {
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== activeChat) return chat;
              const newMessages = [...chat.messages];
              const lastIdx = newMessages.length - 1;
              newMessages[lastIdx] = {
                ...newMessages[lastIdx],
                content: newMessages[lastIdx].content + token,
              };
              return { ...chat, messages: newMessages };
            })
          );
        },
        (error) => {
          console.error("Stream error:", error);
        }
      );
    } catch (err) {
      console.error("Query failed:", err);
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChat) return chat;
          const newMessages = [...chat.messages];
          const lastIdx = newMessages.length - 1;
          if (
            newMessages[lastIdx]?.role === "ai" &&
            !newMessages[lastIdx].content
          ) {
            newMessages[lastIdx] = {
              ...newMessages[lastIdx],
              content: "Error: Failed to get response",
            };
          }
          return { ...chat, messages: newMessages };
        })
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Error state
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <Card className="p-6 text-center bg-slate-800 border-slate-700">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </Card>
      </main>
    );
  }

  // Loading state
  if (!activeChat) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-400"></div>
            <p className="text-slate-300">Connecting...</p>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <ChatSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ChatHeader
          sessionId={activeChat}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <ChatMessages messages={messages} isLoading={isLoading} />

        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </main>
  );
}
