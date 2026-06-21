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
  address: string;

  @Column({ nullable: true })
  displayRegion: string;

  @Column({ nullable: true })
  visibility: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  soilType: string;

  @Column({ nullable: true })
  quantity: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  memo: string;

  @Column({ nullable: true, type: 'text' })
  imageData: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  permitStatus: string;

  @Column({ nullable: true })
  dealStatus: string; // 모집중 / 완료 / 마감 / 보류

  @Column({ default: false })
  isHidden: boolean;

  @Column()
  createdAt: string;
}