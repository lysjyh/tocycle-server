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
  visibility: string; // region = 읍면동만 공개, exact = 정확한 위치 공개

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
  source: string; // user

  @Column({ nullable: true })
  permitStatus: string; // 미확인 / 서류있음 / 허가관련있음

  @Column()
  createdAt: string;
}