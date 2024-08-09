import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoginSuccessResponse } from 'src/auth/types';
import { UsersResponse } from './types';
import { DBService } from './db.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly dbService: DBService,
  ) {}

  async getUsers() {
    const data = await this.cacheManager.get<LoginSuccessResponse>('2');
    if (data) {
      const db = await this.dbService.connectToDatabase({
        host: data.db.host.split(':')[0],
        port: +data.db.host.split(':')[1],
        username: data.db.username,
        password: data.db.pass,
        database: data.db.database,
      });

      try {
        const query =
          'SELECT id, login, group, status, currency, balance, bonus_balance, date_reg FROM users LIMIT 10';

        const users = db.query<UsersResponse>(query);

        console.log(users);

        return users;
      } catch (error) {
        console.error(error);
        throw new BadRequestException('DB request error');
      }
    }

    throw new BadRequestException('Request error');
  }
}
