import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ unique: true })
  email: string;

  @Column()
  gender: string;

  @Column() 
  country: string;

  @Column()
  dateOfBirth: Date;
}
