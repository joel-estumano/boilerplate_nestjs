import {
    ApiOperation,
    ApiTags,
    ApiParam,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { OutputProductDto } from './dto/output-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryPaginateDto } from './dto/products-query-paginate.dto';
import { ProductsOutputPaginateDto } from './dto/products-output-paginate.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a new product',
        description: 'This endpoint creates a new product using the provided data.',
    })
    @ApiCreatedResponse({
        description: 'Product created successfully.',
        type: OutputProductDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data. Please verify the provided information.',
    })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get('paginate')
    @ApiOperation({
        summary: 'Retrieve paginated list of products',
        description: 'Fetches products with optional pagination and search query.',
    })
    @ApiOkResponse({
        description: 'Successfully retrieved paginated list of products.',
        type: ProductsOutputPaginateDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters. Please verify the input.',
    })
    async paginate(@Query() dto: ProductsQueryPaginateDto): Promise<ProductsOutputPaginateDto> {
        return await this.productsService.paginate(dto);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get product details by ID',
        description: 'Retrieves the details of a specific product based on the provided ID.',
    })
    @ApiOkResponse({
        description: 'Product successfully recovered.',
        type: OutputProductDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data. Please verify the provided information.',
    })
    @ApiNotFoundResponse()
    @ApiParam({ name: 'id', required: true, description: 'Product ID' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update a product',
        description: 'Updates product information based on the given ID.',
    })
    @ApiOkResponse({
        description: 'Product updated successfully.',
        type: OutputProductDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data. Please verify the provided information.',
    })
    @ApiNotFoundResponse()
    @ApiParam({ name: 'id', required: true, description: 'Product ID' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a product',
        description: 'Removes a product from the database using the provided ID.',
    })
    @ApiNoContentResponse({
        description: 'Product deleted successfully.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data. Please verify the provided information.',
    })
    @ApiNotFoundResponse()
    @ApiParam({ name: 'id', required: true, description: 'Product ID' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
