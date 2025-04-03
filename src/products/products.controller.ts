import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  @MessagePattern('createProduct')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern('findAllProducts')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto.page, paginationDto.limit);
  }

  // @Get(':uuid')
  @MessagePattern('findOneProduct')
  findOne(@Payload('uuid', ParseUUIDPipe) uuid: string) {
    return this.productsService.findOne(uuid);
  }

  // @Patch(':uuid')
  @MessagePattern('updateProduct')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  // @Delete(':uuid')
  @MessagePattern('deleteProduct')
  remove(@Payload('uuid', ParseUUIDPipe) uuid: string) {
    return this.productsService.remove(uuid);
  }
}
