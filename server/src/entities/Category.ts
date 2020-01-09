import { Column, Entity } from 'typeorm';

@Entity()
export class Category {
  id: number;

  @Column({ length: 5 })
  description: string;
}
