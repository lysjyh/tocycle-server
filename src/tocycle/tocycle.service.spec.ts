import { Test, TestingModule } from '@nestjs/testing';
import { TocycleService } from './tocycle.service';

describe('TocycleService', () => {
  let service: TocycleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TocycleService],
    }).compile();

    service = module.get<TocycleService>(TocycleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
