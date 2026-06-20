import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class NaraProject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  bidNtceNo!: string;

  @Column({ nullable: true })
  bidNtceNm!: string;

  @Column({ nullable: true })
  ntceInsttNm!: string;

  @Column({ nullable: true })
  region!: string;

  @Column({ nullable: true })
  contractor!: string;

  @Column({ nullable: true })
  partnerCompany!: string;

  @Column({ nullable: true })
  amount!: string;

  @Column({ nullable: true })
  bidDate!: string;

  @Column({ nullable: true })
  source!: string;
}