import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

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
      throw new NotFoundException('Product not found');
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
}
