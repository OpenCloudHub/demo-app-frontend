export interface Message {
  role: "human" | "ai";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface SessionResponse {
  session_id: string;
}
