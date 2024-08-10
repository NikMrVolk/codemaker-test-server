import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { LoginResponse } from './types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  DEFAULT_TIMEOUT = 120000;
  DEFAULT_PROJECT_ID = 'vivajack';

  constructor(
    private jwt: JwtService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(dto: LoginDto, ip: string, userAgent: string) {
    const data = {
      login: dto.email,
      method: 'AUTH',
      pass: dto.password,
      ip,
      userAgent,
    };

    try {
      const response = await this.httpService.axiosRef.request<LoginResponse>({
        method: 'POST',
        url: `${process.env.IP_API}api/admins/`,
        timeout: this.DEFAULT_TIMEOUT,
        headers: {
          'X-Project-Id': this.DEFAULT_PROJECT_ID,
          'Content-Type': 'application/json',
        },
        data,
      });

      if ('error' in response.data) {
        throw new BadRequestException('Login failed');
      }

      const user = response.data.user;
      const accessToken = this.issueToken({
        userId: user.id,
      });

      await this.cacheManager.set(String(user.id), response.data);

      return {
        userData: { ...user, role: 'admin' },
        accessToken,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Login failed');
    }
  }

  checkToken(accessToken: string) {
    try {
      const data = this.jwt.decode<{ id: number }>(accessToken);
      console.log(data);
      return data
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Invalid token');
    }
  }

  async deleteDataFromCache(userId: string) {
    return this.cacheManager.del(userId);
  }

  private issueToken({ userId }: { userId: number }) {
    const payload = { id: userId };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION ?? '30m',
    });

    return accessToken;
  }
}
