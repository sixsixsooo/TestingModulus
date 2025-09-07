import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field()
  @IsString()
  content: string;

  @Field(() => ID)
  @IsUUID()
  senderId: string;

  @Field(() => ID)
  @IsUUID()
  receiverId: string;
}
