import { IsUUID, IsArray, IsNotEmpty, IsString } from "class-validator";

export class ValidateProductsDto {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @IsUUID('all', { each: true })
    uuids: string[];
}