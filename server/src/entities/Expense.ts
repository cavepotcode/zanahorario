import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ length: 50 })
  client: string;

  @ManyToOne(type => Category, category => category.id)
  @Column()
  category: number;

  @Column({ length: 1 })
  currency: string;

  @Column()
  amount: number;

  @Column({ length: 5 })
  type: string;

  @Column({ length: 1 })
  paid: number;

  @Column()
  details: string;
}

/*
@Entity()
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
*/
