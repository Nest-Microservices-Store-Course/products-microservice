import { Injectable, OnModuleInit, Logger, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { ValidateProductsDto } from './dto/validate-products.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });

    const total = await this.product.count({ where: { available: true } });

    return {
      data: products,
      meta: {
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(uuid: string) {
    const product = await this.product.findUnique({
      where: { uuid, available: true },
    });

    if (!product) {
      throw new RpcException({
        message: 'Product not found with uuid: ' + uuid,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    await this.findOne(updateProductDto.uuid);

    return this.product.update({
      where: { uuid: updateProductDto.uuid },
      data: updateProductDto,
    });
  }

  async remove(uuid: string) {
    await this.findOne(uuid);

    return this.product.update({
      where: { uuid: uuid },
      data: { available: false },
    });
  }

  async validateProducts(validateProductsDto: ValidateProductsDto) {
    console.log(validateProductsDto);
    const uuids = Array.from(new Set(validateProductsDto.uuids));
    const products = await this.product.findMany({
      where: { uuid: { in: uuids } },
    });

    if (products.length !== uuids.length) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return products;
  }
}
