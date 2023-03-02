import { Module } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';
import { CatsController } from './cats/cats.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
