import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Like } from './like.entity';
import { Message } from './message.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio?: string;

  @Field()
  @Column({ default: 18 })
  age: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImage?: string;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true })
  images?: string[];

  @Field()
  @Column({ default: 'male' })
  gender: string;

  @Field()
  @Column({ default: 'female' })
  interestedIn: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Like, (like) => like.fromUser)
  likesGiven: Like[];

  @OneToMany(() => Like, (like) => like.toUser)
  likesReceived: Like[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}
