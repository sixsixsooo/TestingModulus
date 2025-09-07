import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity('likes')
export class Like {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.likesGiven, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.likesReceived, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
