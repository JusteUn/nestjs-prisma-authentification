import { Module } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';
import { CatsController } from './cats/cats.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
