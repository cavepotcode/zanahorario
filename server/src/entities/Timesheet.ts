import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Project } from './Project';

@Entity()
@Index(['date', 'projectId', 'userId'], { unique: true })
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  hours: number;

  @ManyToOne(type => Project, project => project.timesheets)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(type => User, user => user.timesheets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;
}
