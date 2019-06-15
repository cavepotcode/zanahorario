import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  color: string;

  @Column()
  initials: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;
}
