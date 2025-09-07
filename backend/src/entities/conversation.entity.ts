import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { Message } from './message.entity';

@ObjectType()
export class Conversation {
  @Field(() => User)
  user: User;

  @Field(() => Message)
  lastMessage: Message;

  @Field(() => Int)
  unreadCount: number;
}
