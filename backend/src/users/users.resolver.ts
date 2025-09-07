import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => [User], { name: 'potentialMatches' })
  getPotentialMatches(@Args('userId', { type: () => ID }) userId: string) {
    return this.usersService.getPotentialMatches(userId);
  }

  @Query(() => [User], { name: 'likedUsers' })
  getLikedUsers(@Args('userId', { type: () => ID }) userId: string) {
    return this.usersService.getLikedUsers(userId);
  }

  @Query(() => [User], { name: 'matches' })
  getMatches(@Args('userId', { type: () => ID }) userId: string) {
    return this.usersService.getMatches(userId);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => Like)
  likeUser(
    @Args('fromUserId', { type: () => ID }) fromUserId: string,
    @Args('toUserId', { type: () => ID }) toUserId: string,
  ) {
    return this.usersService.likeUser(fromUserId, toUserId);
  }
}
