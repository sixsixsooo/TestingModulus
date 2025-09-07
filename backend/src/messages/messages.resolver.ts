import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { MessagesService } from './messages.service';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { CreateMessageInput } from './dto/create-message.input';

const pubSub = new PubSub();

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    const message = await this.messagesService.create(createMessageInput);

    // Публикуем событие для подписчиков
    pubSub.publish('messageAdded', { messageAdded: message });

    return message;
  }

  @Query(() => [Message], { name: 'conversation' })
  findConversation(
    @Args('userId1', { type: () => ID }) userId1: string,
    @Args('userId2', { type: () => ID }) userId2: string,
  ) {
    return this.messagesService.findConversation(userId1, userId2);
  }

  @Query(() => [Conversation], { name: 'conversations' })
  getConversations(@Args('userId', { type: () => ID }) userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Mutation(() => Message)
  markAsRead(@Args('messageId', { type: () => ID }) messageId: string) {
    return this.messagesService.markAsRead(messageId);
  }

  @Mutation(() => Boolean)
  markConversationAsRead(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('otherUserId', { type: () => ID }) otherUserId: string,
  ) {
    return this.messagesService.markConversationAsRead(userId, otherUserId);
  }

  @Subscription(() => Message)
  messageAdded() {
    return pubSub.asyncIterableIterator('messageAdded');
  }
}
