import { Test, TestingModule } from '@nestjs/testing';
import { QrsController } from './qrs.controller';

describe('QrsController', () => {
  let controller: QrsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrsController],
    }).compile();

    controller = module.get<QrsController>(QrsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
