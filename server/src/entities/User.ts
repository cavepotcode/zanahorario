import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Timesheet } from './Timesheet';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  password: string;

  @Column({ length: 50 })
  email: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true, length: 20 })
  color: string;

  @Column({ nullable: true, length: 10 })
  initials: string;

  @Column({ nullable: true, length: 20 })
  name: string;

  @Column({ nullable: true, length: 50 })
  photo: string;

  @OneToMany(type => Timesheet, timesheet => timesheet.user)
  timesheets: Timesheet[];
}
