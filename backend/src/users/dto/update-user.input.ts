import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  age?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  images?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;
}
