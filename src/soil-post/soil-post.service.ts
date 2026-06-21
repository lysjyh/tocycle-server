import { Injectable, NotFoundException } from '@nestjs/common';
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
      address: data.address || '',
      displayRegion: data.displayRegion || data.region || '',
      visibility: data.visibility || 'region',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      soilType: data.soilType || '',
      quantity: data.quantity || '',
      contact: data.contact || '',
      memo: data.memo || '',
      imageData: data.imageData || '',
      source: 'user',
      permitStatus: data.permitStatus || '미확인',
      dealStatus: data.dealStatus || '모집중',
      isHidden: false,
      createdAt: new Date().toISOString(),
    });
  }

  async findAll() {
    return this.repo.find({
      where: { isHidden: false },
      order: { id: 'DESC' },
    });
  }

  async findHidden() {
    return this.repo.find({
      where: { isHidden: true },
      order: { id: 'DESC' },
    });
  }

  async update(id: number, data: Partial<SoilPost>) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    Object.assign(post, {
      category: data.category ?? post.category,
      title: data.title ?? post.title,
      region: data.region ?? post.region,
      address: data.address ?? post.address,
      displayRegion: data.displayRegion ?? post.displayRegion,
      visibility: data.visibility ?? post.visibility,
      latitude: data.latitude ?? post.latitude,
      longitude: data.longitude ?? post.longitude,
      soilType: data.soilType ?? post.soilType,
      quantity: data.quantity ?? post.quantity,
      contact: data.contact ?? post.contact,
      memo: data.memo ?? post.memo,
      imageData: data.imageData ?? post.imageData,
      permitStatus: data.permitStatus ?? post.permitStatus,
      dealStatus: data.dealStatus ?? post.dealStatus,
    });

    return this.repo.save(post);
  }

  async hide(id: number) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    post.isHidden = true;
    return this.repo.save(post);
  }

  async restore(id: number) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    post.isHidden = false;
    return this.repo.save(post);
  }

  async remove(id: number) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    return this.repo.remove(post);
  }
}