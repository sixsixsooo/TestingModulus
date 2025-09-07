import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { CreateMessageInput } from './dto/create-message.input';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createMessageInput: CreateMessageInput): Promise<Message> {
    const sender = await this.usersRepository.findOne({
      where: { id: createMessageInput.senderId },
    });
    const receiver = await this.usersRepository.findOne({
      where: { id: createMessageInput.receiverId },
    });

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    const message = this.messagesRepository.create({
      content: createMessageInput.content,
      sender,
      receiver,
    });

    return this.messagesRepository.save(message);
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where(
        '(message.senderId = :userId1 AND message.receiverId = :userId2) OR ' +
          '(message.senderId = :userId2 AND message.receiverId = :userId1)',
        { userId1, userId2 },
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async getConversations(userId: string): Promise<any[]> {
    const conversations = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('message.senderId = :userId OR message.receiverId = :userId', {
        userId,
      })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Группируем сообщения по собеседникам
    const conversationMap = new Map();

    conversations.forEach((message) => {
      const otherUserId =
        message.sender.id === userId ? message.receiver.id : message.sender.id;
      const otherUser =
        message.sender.id === userId ? message.receiver : message.sender;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      if (!message.isRead && message.receiver.id === userId) {
        conversationMap.get(otherUserId).unreadCount++;
      }
    });

    return Array.from(conversationMap.values());
  }

  async markAsRead(messageId: string): Promise<Message | null> {
    await this.messagesRepository.update(messageId, { isRead: true });
    return this.messagesRepository.findOne({
      where: { id: messageId },
      relations: ['sender', 'receiver'],
    });
  }

  async markConversationAsRead(
    userId: string,
    otherUserId: string,
  ): Promise<boolean> {
    await this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where(
        'senderId = :otherUserId AND receiverId = :userId AND isRead = false',
        {
          userId,
          otherUserId,
        },
      )
      .execute();

    return true;
  }
}
