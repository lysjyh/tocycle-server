import { Test, TestingModule } from '@nestjs/testing';
import { TocycleController } from './tocycle.controller';

describe('TocycleController', () => {
  let controller: TocycleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TocycleController],
    }).compile();

    controller = module.get<TocycleController>(TocycleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
