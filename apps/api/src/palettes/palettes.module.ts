import { Module } from '@nestjs/common';
import { PaletteController } from './palette/palette.controller';
import { PaletteService } from './palette/palette.service';
import { ColorController } from './color/color.controller';
import { ColorService } from './color/color.service';

@Module({
  controllers: [PaletteController, ColorController],
  providers: [PaletteService, ColorService],
})
export class PalettesModule {}
