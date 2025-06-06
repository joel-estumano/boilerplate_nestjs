import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PRODUCT_REPOSITORY } from '@common/constants/repository.tokens';
import { Repository } from 'typeorm';

describe('ProductsService', () => {
    let service: ProductsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductsService, { provide: PRODUCT_REPOSITORY, useValue: {} as Repository<any> }],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
