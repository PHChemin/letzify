import { Module } from '@nestjs/common';
import { TypographiesController } from './typographies.controller';
import { TypographiesService } from './typographies.service';

@Module({
  controllers: [TypographiesController],
  providers: [TypographiesService],
})
export class TypographiesModule {}
