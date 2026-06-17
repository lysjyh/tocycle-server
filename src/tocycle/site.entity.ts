import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  orgName: string;

  @Column({ nullable: true })
  addr: string;

  @Column({ nullable: true })
  xpos: string;

  @Column({ nullable: true })
  ypos: string;

  @Column({ nullable: true })
  siteType: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  updatedAt: string;
}