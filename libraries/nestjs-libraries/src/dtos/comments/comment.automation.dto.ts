import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReglaDto {
  @IsArray()
  @IsString({ each: true })
  palabras: string[];

  @IsString()
  // Instagram corta los comentarios largos. Se limita antes de guardar para
  // que el odontologo se entere al escribir y no cuando la respuesta falla.
  @MaxLength(1000)
  respuesta: string;
}

export class CommentAutomationDto {
  @IsBoolean()
  active: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReglaDto)
  rules: ReglaDto[];

  @IsArray()
  @IsString({ each: true })
  stopWords: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  fallbackReply?: string;
}
