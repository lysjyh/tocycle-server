import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Site } from './site.entity';

@Injectable()
export class TocycleService {
  private readonly apiUrl = 'http://apis.data.go.kr/1613000/Tocycle/SoilComList';

  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
  ) {}

  async testFetch() {
    const serviceKey = process.env.TOCYCLE_API_KEY;

    const response = await axios.get(this.apiUrl, {
      params: {
        serviceKey,
        pageNo: 1,
        numOfRows: 10,
        _type: 'json',
      },
    });

    return response.data;
  }

  async sync() {
    const serviceKey = process.env.TOCYCLE_API_KEY;

    const response = await axios.get(this.apiUrl, {
      params: {
        serviceKey,
        pageNo: 1,
        numOfRows: 1000,
        _type: 'json',
      },
    });

    const items = response.data?.response?.body?.items?.item || [];
    const list = Array.isArray(items) ? items : [items];

    await this.siteRepository.clear();

    const saved = await this.siteRepository.save(
  list.map((item) => ({
  orgName: item.orgComName || item.menName || '',
  addr: item.addr || '',
  xpos: item.xpos || '',
  ypos: item.ypos || '',
  siteType: item.comClass || '',
  phone: item.telNo || item.telno || item.phone || '',
  status: '공공데이터',
  source: 'TOCYCLE',
  updatedAt: '',
  ownerName: item.master || '',
  orgCode: item.orgComNum || '',
  managerName: item.memName || '',
}))
);

    return {
      success: true,
      count: saved.length,
    };
  }

  async findAll() {
    return this.siteRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }
}