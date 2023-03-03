import { Get, UseGuards, Controller, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { exclude } from 'prisma/exclude';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseApi } from 'src/common';
import { UserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<ResponseApi> {
    return {
      success: true,
      message: 'Users found successfully',
      data: (await this.usersService.findAll()).map((user: Users) =>
        exclude(user, ['password']),
      ),
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req): ResponseApi {
    return {
      success: true,
      message: 'User found successfully',
      data: req.user,
    };
  }
}
