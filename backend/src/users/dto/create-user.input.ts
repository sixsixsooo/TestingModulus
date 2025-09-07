import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field()
  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  images?: string[];

  @Field()
  @IsString()
  gender: string;

  @Field()
  @IsString()
  interestedIn: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;
}
