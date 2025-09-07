import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
