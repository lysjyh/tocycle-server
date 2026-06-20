import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SoilPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column()
  region: string;

  @Column({ nullable: true })
  soilType: string;

  @Column({ nullable: true })
  quantity: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  memo: string;

  @Column()
  createdAt: string;
}