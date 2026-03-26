import type { SQLiteDatabase } from 'expo-sqlite';
import type { ChatMessage } from '../llm/types';

interface ChatMessageRow {
  id: string;
  role: string;
  content: string;
  created_at: number;
}

function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    role: row.role as ChatMessage['role'],
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function getChatMessages(db: SQLiteDatabase): Promise<ChatMessage[]> {
  const rows = await db.getAllAsync<ChatMessageRow>(
    `SELECT * FROM chat_messages ORDER BY created_at ASC`
  );
  return rows.map(rowToMessage);
}

export async function insertChatMessage(
  db: SQLiteDatabase,
  msg: Omit<ChatMessage, 'id'>
): Promise<string> {
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await db.runAsync(
    `INSERT INTO chat_messages (id, role, content, created_at) VALUES (?, ?, ?, ?)`,
    [id, msg.role, msg.content, msg.createdAt]
  );
  return id;
}

export async function clearChatHistory(db: SQLiteDatabase): Promise<void> {
  await db.runAsync(`DELETE FROM chat_messages`);
}
