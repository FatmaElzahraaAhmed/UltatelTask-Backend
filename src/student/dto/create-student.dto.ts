import {
  IsString,
  IsEmail,
  IsInt,
  IsDate,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export class CreateStudentDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the student' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 20,
    description: 'The age of the student',
    minimum: 16,
    maximum: 30,
  })
  @IsInt()
  @Min(16)
  @Max(30)
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the student',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Male',
    enum: Gender,
    description: 'The gender of the student',
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ example: 'USA', description: 'The country of the student' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'The birth date of the student',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;
}
