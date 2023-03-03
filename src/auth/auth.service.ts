import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { exclude } from 'prisma/exclude';
import { ResponseApi } from 'src/common';
import { CreateUserDto, LoginUserDto, UserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<ResponseApi> {
    let user;
    try {
      user = await this.userService.create(userDto);
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
    const Authorization = this._createToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return {
      success: true,
      message: 'User created successfully',
      data: {
        Authorization,
        user: exclude(user, ['password']),
      },
    };
  }

  async login(userDto: LoginUserDto): Promise<ResponseApi> {
    let user;
    try {
      user = await this.userService.findByLogin(userDto);
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
    const Authorization = this._createToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return {
      success: true,
      message: 'User logged in successfully',
      data: {
        Authorization,
        user: exclude(user, ['password']),
      },
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findByPayload(payload.user);
    if (!user) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
    return exclude(user, ['password']);
  }

  private _createToken(userDto: UserDto): any {
    const user: JwtPayload = { user: userDto };
    const Authorization = this.jwtService.sign(user);
    return Authorization;
  }
}
