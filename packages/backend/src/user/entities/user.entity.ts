import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column('character varying', { length: 30 })
  name: string;

  @Column('character varying', { length: 50 })
  surname: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  bioStatus: string;

  @Column({
    default:
      'https://fastly.picsum.photos/id/196/125/125.jpg?hmac=aUg4DYaS8vr41e9867oAw03e_cG9lK8Wv-Vrr57RMr0',
  })
  photoUrl: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Promise<Conversation[]>;
}
