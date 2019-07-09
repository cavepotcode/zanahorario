import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Project } from './Project';

@Entity()
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  hours: number;

  @Column({ length: 500 })
  observations: string;

  @ManyToOne(type => Project, project => project.timesheets)
  project: Project;

  @Column()
  projectId: number;

  @ManyToOne(type => User, user => user.timesheets)
  user: User;

  @Column()
  userId: number;
}
