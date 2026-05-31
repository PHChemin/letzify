import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { PalettesModule } from './palettes/palettes.module';
import { TypographiesModule } from './typographies/typographies.module';
import { AssetsModule } from './assets/assets.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    UsersModule,
    ProjectsModule,
    PalettesModule,
    TypographiesModule,
    AssetsModule,
    PrismaModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
