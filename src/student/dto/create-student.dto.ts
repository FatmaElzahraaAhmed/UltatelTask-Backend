import {
  IsString,
  IsEmail,
  IsDate,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateInRange } from './isDateInRange.decorator';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export class CreateStudentDto {
  @ApiProperty({ example: 'John', description: 'The first name of the student' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the student' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

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
    example: '2005-06-15',
    description: 'The birth date of the student',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsDateInRange(14, 24, {
    message: 'Date of birth must be between 14 and 24 years from today',
  })
  dateOfBirth: Date;
}
