import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User | null> {
    await this.usersRepository.update(id, updateUserInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async likeUser(fromUserId: string, toUserId: string): Promise<Like> {
    const fromUser = await this.findOne(fromUserId);
    const toUser = await this.findOne(toUserId);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: { fromUser: { id: fromUserId }, toUser: { id: toUserId } },
    });

    if (existingLike) {
      throw new Error('User already liked');
    }

    const like = this.likesRepository.create({
      fromUser,
      toUser,
    });

    return this.likesRepository.save(like);
  }

  async getLikedUsers(userId: string): Promise<User[]> {
    const likes = await this.likesRepository.find({
      where: { fromUser: { id: userId } },
      relations: ['toUser'],
    });

    return likes.map((like) => like.toUser);
  }

  async getMatches(userId: string): Promise<User[]> {
    // Найти пользователей, которых лайкнул текущий пользователь
    const userLikes = await this.likesRepository.find({
      where: { fromUser: { id: userId } },
      relations: ['toUser'],
    });

    const matches: User[] = [];

    for (const like of userLikes) {
      // Проверить, лайкнул ли этот пользователь обратно
      const reciprocalLike = await this.likesRepository.findOne({
        where: {
          fromUser: { id: like.toUser.id },
          toUser: { id: userId },
        },
        relations: ['fromUser'],
      });

      if (reciprocalLike) {
        matches.push(like.toUser);
      }
    }

    return matches;
  }

  async getPotentialMatches(userId: string): Promise<User[]> {
    const currentUser = await this.findOne(userId);

    if (!currentUser) {
      return [];
    }

    // Получить всех пользователей, которых еще не лайкнул
    const likedUserIds = await this.likesRepository
      .createQueryBuilder('like')
      .select('like.toUserId')
      .where('like.fromUserId = :userId', { userId })
      .getRawMany();

    const likedIds = likedUserIds.map((like) => like.toUserId);
    likedIds.push(userId); // Исключить себя

    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id NOT IN (:...likedIds)', { likedIds })
      .andWhere('user.interestedIn = :gender', { gender: currentUser.gender })
      .andWhere('user.gender = :interestedIn', {
        interestedIn: currentUser.interestedIn,
      })
      .getMany();
  }
}
