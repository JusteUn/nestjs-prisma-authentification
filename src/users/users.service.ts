import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto, UserDto } from './dto';
import { compare, hash } from 'bcrypt';
import { exclude } from 'prisma/exclude';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<Users> {
    const userExists = await this.prisma.users.findFirst({
      where: { email: userDto.email },
    });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const user = await this.prisma.users.create({
      data: {
        ...userDto,
        password: await hash(userDto.password, 10),
      },
    });
    return user;
  }

  async findByLogin(userDto: LoginUserDto): Promise<Users | null> {
    const user = await this.prisma.users.findFirst({
      where: { email: userDto.email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const isMatch = await compare(userDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async findAll(): Promise<Users[]> {
    return await await this.prisma.users.findMany();
  }

  async findByPayload(payload: UserDto): Promise<Users | null> {
    const user = await this.prisma.users.findFirst({
      where: payload,
    });
    return user;
  }
}
