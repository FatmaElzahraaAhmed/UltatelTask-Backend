import { Injectable, ConflictException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      return await this.studentRepository.createStudent(createStudentDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email is already taken');
      }
    }
  }

  findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  findOne(id: number): Promise<Student> {
    return this.studentRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student | null> {
    try {
      return await this.studentRepository.updateStudent(id, updateStudentDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email is already taken');
      }
    }
  }

  async remove(id: number): Promise<boolean> {
    return await this.studentRepository.deleteStudent(id);
  }
}
