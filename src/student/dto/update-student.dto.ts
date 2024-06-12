import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the student',
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'The age of the student',
    minimum: 16,
    maximum: 30,
  })
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'The email of the student',
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'Male',
    enum: Gender,
    description: 'The gender of the student',
  })
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({
    example: 'USA',
    description: 'The country of the student',
  })
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    example: '2000-01-01',
    description: 'The birth date of the student',
    type: String,
    format: 'date',
  })
  @IsOptional()
  dateOfBirth?: Date;
}
