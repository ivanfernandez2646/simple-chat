import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: Promise<User>;

  @Column()
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: Promise<User>;

  @Column()
  receiverId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Promise<Conversation>;

  @Column()
  conversationId: string;

  @Column('character varying', { length: 50 })
  text: string;

  @Column({ type: 'bool', default: false })
  isFavourite: boolean;

  @Column({ type: 'bool', default: false })
  isReadByReceiver: boolean;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.lastMessage)
  conversationForLastMessage: Promise<Conversation>;
}
