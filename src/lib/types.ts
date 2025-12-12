/**
 * Represents a single chat message in the conversation.
 */
export interface Message {
  /** The role of the message sender - either human user or AI assistant */
  role: "human" | "ai";
  /** The text content of the message */
  content: string;
}

/**
 * Represents a chat session containing conversation history.
 */
export interface ChatSession {
  /** Unique identifier for the session (from backend) */
  id: string;
  /** Display title for the chat (derived from first message) */
  title: string;
  /** Array of messages in chronological order */
  messages: Message[];
  /** Timestamp when the session was created */
  createdAt: Date;
}

/**
 * Response from the backend when creating a new session.
 */
export interface SessionResponse {
  /** The unique session identifier assigned by the backend */
  session_id: string;
}
