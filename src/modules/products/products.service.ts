import { CreateProductDto } from './dto/create-product.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { PRODUCT_REPOSITORY } from '@common/constants/repository.tokens';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryPaginateDto } from './dto/products-query-paginate.dto';
import { ProductsOutputPaginateDto } from './dto/products-output-paginate.dto';

@Injectable()
export class ProductsService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private productRepository: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async paginate(queryDto: ProductsQueryPaginateDto): Promise<ProductsOutputPaginateDto> {
        const { pagination, page, limit, search } = queryDto;
        const queryBuilder = this.productRepository.createQueryBuilder('product');

        if (search) {
            queryBuilder.where('product.name LIKE :search OR product.description LIKE :search', { search: `%${search}%` });
        }

        if (pagination) {
            queryBuilder.take(limit).skip((page - 1) * limit);
        }

        const [data, totalDocs] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(totalDocs / limit);

        return {
            data,
            totalDocs,
            totalPages,
            pagingCounter: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            limit,
        };
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const updateResult = await this.productRepository.update(id, updateProductDto);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        const updatedProduct = await this.productRepository.findOne({ where: { id } });
        if (!updatedProduct) {
            throw new NotFoundException(`Updated product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    async remove(id: number): Promise<void> {
        const deleteResult = await this.productRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }
}
