import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Timesheet } from './Timesheet';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @OneToMany(type => Timesheet, timesheet => timesheet.project)
  timesheets: Timesheet[];
}
