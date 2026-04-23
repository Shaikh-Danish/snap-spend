import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, relation, readonly } from '@nozbe/watermelondb/decorators';
import ChatThread from './chat-thread';

export default class ChatMessage extends Model {
  static table = 'chat_messages';

  static associations = {
    chat_threads: { type: 'belongs_to', key: 'thread_id' },
  } as const;

  @field('content') content!: string;
  @field('role') role!: 'user' | 'assistant';
  @field('status') status?: 'sending' | 'sent' | 'failed';
  @readonly @date('created_at') createdAt!: Date;

  @relation('chat_threads', 'thread_id') thread!: Relation<ChatThread>;
}
