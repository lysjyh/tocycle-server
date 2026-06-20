import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoilPost } from './soil-post.entity';

@Injectable()
export class SoilPostService {
  constructor(
    @InjectRepository(SoilPost)
    private readonly repo: Repository<SoilPost>,
  ) {}

  async create(data: Partial<SoilPost>) {
    return this.repo.save({
      category: data.category || '발생토',
      title: data.title || '',
      region: data.region || '',
      soilType: data.soilType || '',
      quantity: data.quantity || '',
      contact: data.contact || '',
      memo: data.memo || '',
      createdAt: new Date().toISOString(),
    });
  }

  async findAll() {
    return this.repo.find({
      order: {
        id: 'DESC',
      },
    });
  }
}