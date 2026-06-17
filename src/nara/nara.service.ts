import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { NaraProject } from './nara.entity';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class NaraService {
  private readonly apiUrl =
    'http://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoCnstwk';
    private readonly winApiUrl =
  'http://apis.data.go.kr/1230000/as/ScsbidInfoService/getScsbidListSttusCnstwk';
  private readonly contractApiUrl =
  'http://apis.data.go.kr/1230000/ao/CntrctInfoService/getCntrctInfoListCnstwk';

  constructor(
    @InjectRepository(NaraProject)
    private readonly naraRepository: Repository<NaraProject>,
  ) {}

  async testFetch() {
    const serviceKey = process.env.DATA_GO_KR_API_KEY;

    const response = await axios.get(this.apiUrl, {
      params: {
  serviceKey,
  pageNo: 1,
  numOfRows: 10,
  inqryDiv: '1',
  inqryBgnDt: '202606010000',
inqryEndDt: '202606172359',
resultType: 'json',
  _type: 'json',
},
    });

    return response.data;
  }

  async sync() {
    const serviceKey = process.env.DATA_GO_KR_API_KEY;

    const response = await axios.get(this.apiUrl, {
      params: {
  serviceKey,
  pageNo: 1,
  numOfRows: 100,
  inqryDiv: '1',
  inqryBgnDt: '202606010000',
inqryEndDt: '202606172359',
resultType: 'json',
  _type: 'json',
},
    });

    const parser = new XMLParser();
const parsed =
  typeof response.data === 'string' ? parser.parse(response.data) : response.data;

const items = parsed?.response?.body?.items?.item || [];
const list = Array.isArray(items) ? items : [items];

    const saved = await this.naraRepository.save(
      list.map((item) => ({
        bidNtceNo: item.bidNtceNo || '',
        bidNtceNm: item.bidNtceNm || '',
        ntceInsttNm: item.ntceInsttNm || '',
        region: item.prtcptPsblRgnNm || item.dminsttNm || '',
        amount: item.presmptPrce || item.asignBdgtAmt || '',
        bidDate: item.bidNtceDt || item.bidClseDt || '',
        source: '나라장터 입찰공고',
      })),
    );

    return {
      success: true,
      count: saved.length,
    };
  }

async syncWins() {
  const serviceKey = process.env.DATA_GO_KR_API_KEY;
  const parser = new XMLParser();

  const numOfRows = 100;
  let pageNo = 1;
  let totalCount = 0;
  let totalSaved = 0;

  while (true) {
    const response = await axios.get(this.winApiUrl, {
      params: {
        serviceKey,
        pageNo,
        numOfRows,
        inqryDiv: '1',
        inqryBgnDt: '202606010000',
        inqryEndDt: '202606172359',
        _type: 'json',
      },
    });

    const parsed =
      typeof response.data === 'string'
        ? parser.parse(response.data)
        : response.data;

    const body = parsed?.response?.body;
    const items = body?.items?.item || [];
    const list = Array.isArray(items) ? items : [items];

    totalCount = Number(body?.totalCount || 0);

    if (list.length === 0) break;

    const saved = await this.naraRepository.save(
      list.map((item) => ({
        bidNtceNo: item.bidNtceNo || '',
        bidNtceNm: item.bidNtceNm || item.cnstwkNm || item.bidNtceNm || '',
        ntceInsttNm: item.dminsttNm || item.ntceInsttNm || '',
        region: item.opengPlce || item.dminsttNm || '',
        amount: item.scsbidAmt || item.presmptPrce || '',
        bidDate: item.scsbidDate || item.opengDt || '',
        source: '나라장터 낙찰정보',
      })),
    );

    totalSaved += saved.length;

    if (pageNo * numOfRows >= totalCount) break;

    pageNo += 1;
  }

  return {
    success: true,
    totalCount,
    saved: totalSaved,
  };
}
async syncContracts() {
  const serviceKey = process.env.DATA_GO_KR_API_KEY;
  const parser = new XMLParser();

  const numOfRows = 100;
  let pageNo = 1;
  let totalCount = 0;
  let totalSaved = 0;

  while (true) {
    const response = await axios.get(this.contractApiUrl, {
      params: {
        serviceKey,
        pageNo,
        numOfRows,
        inqryDiv: '1',
        inqryBgnDt: '202606010000',
        inqryEndDt: '202606172359',
        _type: 'json',
      },
    });

    const parsed =
      typeof response.data === 'string'
        ? parser.parse(response.data)
        : response.data;

    const body = parsed?.response?.body;
    const items = body?.items?.item || [];
    const list = Array.isArray(items) ? items : [items];

    totalCount = Number(body?.totalCount || 0);

    if (list.length === 0) break;

    const saved = await this.naraRepository.save(
      list.map((item) => ({
        bidNtceNo: item.bidNtceNo || item.cntrctNo || '',
        bidNtceNm: item.cntrctNm || item.cntrctItemNm || item.prdctClsfcNoNm || '',
        ntceInsttNm: item.dminsttNm || item.cntrctInsttNm || '',
        region: item.dminsttNm || item.cntrctInsttNm || '',
        amount: item.cntrctAmt || item.totCntrctAmt || '',
        bidDate: item.cntrctCnclsDate || item.cntrctDt || '',
        source: '나라장터 계약정보',
      })),
    );

    totalSaved += saved.length;

    if (pageNo * numOfRows >= totalCount) break;

    pageNo += 1;
  }

  return {
    success: true,
    totalCount,
    saved: totalSaved,
  };
}
  async findAll() {
    return this.naraRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}