import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { PalettesModule } from './palettes/palettes.module';
import { TypographiesModule } from './typographies/typographies.module';
import { AssetsModule } from './assets/assets.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule, PalettesModule, TypographiesModule, AssetsModule, PrismaModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
