import { database } from '@/model';
import ChatMessage from '@/model/chat-message';
import ChatThread from '@/model/chat-thread';

export const ChatService = {
  async getOrCreateThread(existingThread: ChatThread | null, firstMessage: string): Promise<ChatThread> {
    if (existingThread) return existingThread;

    let newThread: ChatThread | null = null;
    await database.write(async () => {
      newThread = await database.get<ChatThread>('chat_threads').create((t) => {
        t.title = firstMessage.slice(0, 50);
      });
    });

    if (!newThread) throw new Error('Failed to create chat thread');
    return newThread;
  },

  async saveMessage(thread: ChatThread, content: string, role: 'user' | 'assistant'): Promise<ChatMessage> {
    let message: ChatMessage | null = null;
    await database.write(async () => {
      message = await database.get<ChatMessage>('chat_messages').create((m) => {
        m.thread.set(thread);
        m.content = content.trim();
        m.role = role;
        m.status = 'sent';
      });
    });

    if (!message) throw new Error(`Failed to save ${role} message`);
    return message;
  },
};
