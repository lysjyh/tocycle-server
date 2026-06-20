import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { NaraProject } from './nara.entity';

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

  private getApiKey() {
    const serviceKey = process.env.DATA_GO_KR_API_KEY;

    if (!serviceKey) {
      throw new Error('DATA_GO_KR_API_KEY가 .env에 없습니다.');
    }

    return serviceKey;
  }

  private parse(data: any) {
    const parser = new XMLParser();
    return typeof data === 'string' ? parser.parse(data) : data;
  }

  private toList(items: any) {
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  }

  private getTitle(item: any) {
  return (
    item.bidNtceNm ||
    item.cntrctNm ||
    item.cntrctItemNm ||
    item.cnstwkNm ||
    item.cntwrkNm ||
    item.cnstwkPrdnm ||
    item.prdctClsfcNoNm ||
    item.bizNm ||
    item.ntceNm ||
    '공사명 미공개'
  );
}

  private getOwner(item: any) {
    return (
      item.ntceInsttNm ||
      item.dminsttNm ||
      item.cntrctInsttNm ||
      item.orderInsttNm ||
      item.insttNm ||
      ''
    );
  }

  private getRegion(item: any) {
    return (
      item.prtcptPsblRgnNm ||
      item.dminsttNm ||
      item.ntceInsttNm ||
      item.cntrctInsttNm ||
      item.opengPlce ||
      ''
    );
  }

  private getAmount(item: any) {
    return (
      item.presmptPrce ||
      item.asignBdgtAmt ||
      item.scsbidAmt ||
      item.scsbidPrce ||
      item.bidAmt ||
      item.cntrctAmt ||
      item.cntrctAmount ||
      item.totCntrctAmt ||
      item.thtmCntrctAmt ||
      item.fnlCntrctAmt ||
      ''
    );
  }

  private getDate(item: any) {
    return (
      item.bidNtceDt ||
      item.bidClseDt ||
      item.opengDt ||
      item.opengDate ||
      item.scsbidDate ||
      item.scsbidDt ||
      item.cntrctCnclsDate ||
      item.cntrctDate ||
      item.cntrctDt ||
      item.cntrctDe ||
      item.rgstDt ||
      ''
    );
  }

  private getContractor(item: any) {
    return (
      item.cntrctEntrpsNm ||
      item.cntrctCorpNm ||
      item.scsbidwinnrNm ||
      item.scsbidWinnrNm ||
      item.bidwinnrNm ||
      item.bidderNm ||
      item.entrpsNm ||
      item.opengCorpInfo ||
      ''
    );
  }

  async testFetch() {
    const serviceKey = this.getApiKey();

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
    const serviceKey = this.getApiKey();

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

    const parsed = this.parse(response.data);
    const items = parsed?.response?.body?.items?.item;
    const list = this.toList(items);

    const saved = await this.naraRepository.save(
      list.map((item) => ({
        bidNtceNo: item.bidNtceNo || '',
        bidNtceNm: this.getTitle(item),
        ntceInsttNm: this.getOwner(item),
        region: this.getRegion(item),
        contractor: this.getContractor(item),
        partnerCompany: '',
        amount: this.getAmount(item),
        bidDate: this.getDate(item),
        source: '나라장터 입찰공고',
      })),
    );

    return {
      success: true,
      source: '나라장터 입찰공고',
      count: saved.length,
    };
  }

  async syncWins() {
    const serviceKey = this.getApiKey();

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
          resultType: 'json',
          _type: 'json',
        },
      });

      const parsed = this.parse(response.data);
      const body = parsed?.response?.body;
      const list = this.toList(body?.items?.item);

      totalCount = Number(body?.totalCount || 0);

      if (list.length === 0) break;

      const saved = await this.naraRepository.save(
        list.map((item) => ({
          bidNtceNo: item.bidNtceNo || item.bidno || '',
          bidNtceNm: this.getTitle(item),
          ntceInsttNm: this.getOwner(item),
          region: this.getRegion(item),
          contractor: this.getContractor(item),
          partnerCompany: '',
          amount: this.getAmount(item),
          bidDate: this.getDate(item),
          source: '나라장터 낙찰정보',
        })),
      );

      totalSaved += saved.length;

      if (pageNo * numOfRows >= totalCount) break;

      pageNo += 1;
    }

    return {
      success: true,
      source: '나라장터 낙찰정보',
      totalCount,
      saved: totalSaved,
    };
  }

  async syncContracts() {
    const serviceKey = this.getApiKey();

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
          resultType: 'json',
          _type: 'json',
        },
      });

      const parsed = this.parse(response.data);
      const body = parsed?.response?.body;
      const list = this.toList(body?.items?.item);

      totalCount = Number(body?.totalCount || 0);

      if (list.length === 0) break;

      const saved = await this.naraRepository.save(
        list.map((item) => ({
          bidNtceNo:
            item.bidNtceNo ||
            item.cntrctNo ||
            item.untyCntrctNo ||
            '',
          bidNtceNm: this.getTitle(item),
          ntceInsttNm: this.getOwner(item),
          region: this.getRegion(item),
          contractor: this.getContractor(item),
          partnerCompany: '',
          amount: this.getAmount(item),
          bidDate: this.getDate(item),
          source: '나라장터 계약정보',
        })),
      );

      totalSaved += saved.length;

      if (pageNo * numOfRows >= totalCount) break;

      pageNo += 1;
    }

    return {
      success: true,
      source: '나라장터 계약정보',
      totalCount,
      saved: totalSaved,
    };
  }

    async testContracts() {
    const serviceKey = this.getApiKey();

    const response = await axios.get(this.contractApiUrl, {
      params: {
        serviceKey,
        pageNo: 1,
        numOfRows: 3,
        inqryDiv: '1',
        inqryBgnDt: '202606010000',
        inqryEndDt: '202606172359',
        resultType: 'json',
        _type: 'json',
      },
    });

    return response.data;
  }

  async findAll() {
    return this.naraRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}