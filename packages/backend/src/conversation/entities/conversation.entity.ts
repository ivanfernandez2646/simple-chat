import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  users: Promise<User[]>;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Promise<Message[]>;

  @ManyToOne(() => Message, (message) => message.conversationForLastMessage, {
    nullable: true,
  })
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage?: Promise<Message>;

  @Column({ nullable: true })
  lastMessageId?: string;

  @Column({ type: 'time with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
