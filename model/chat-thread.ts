import { Model, Query } from '@nozbe/watermelondb';
import { children, date, field, readonly } from '@nozbe/watermelondb/decorators';
import ChatMessage from './chat-message';

export default class ChatThread extends Model {
  static table = 'chat_threads';

  static associations = {
    chat_messages: { type: 'has_many', foreignKey: 'thread_id' },
  } as const;

  @field('title') title!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('chat_messages') messages!: Query<ChatMessage>;
}
