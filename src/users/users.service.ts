import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoginSuccessResponse } from 'src/auth/types';
import { User, UsersResponse } from './types';
import { DBService } from './db.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly dbService: DBService,
  ) {}

  async getUsers(
    sort: { field: keyof User; direction: 'asc' | 'desc' } = {
      field: 'id',
      direction: 'asc',
    },
    searchQuery: {
      group?: string;
      status?: string;
      currency?: string;
    } = {},
    limit: number = 10,
  ) {
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
        const queryConditions: string[] =
          this.buildQueryConditions(searchQuery);
        const queryConditionString = queryConditions.join(' AND ');

        const querySQL = `
        SELECT id, login, \`group\`, status, currency, balance, bonus_balance, date_reg
        FROM users
        ${queryConditionString ? `WHERE ${queryConditionString.replace('group', '`group`')}` : ''}
        ORDER BY ${sort.field} ${sort.direction}
        ${limit ? `LIMIT ${limit}` : ''}
      `;

        const dataFromCache =
          await this.cacheManager.get<UsersResponse>(querySQL);

        if (dataFromCache) {
          return dataFromCache;
        } else {
          const response = await db.query<UsersResponse>(querySQL);
          await this.cacheManager.set(querySQL, response);
          return response;
        }
      } catch (error) {
        console.error(error);
        throw new BadRequestException('DB request error');
      }
    }

    throw new BadRequestException('Request error');
  }

  private buildQueryConditions(searchQuery: {
    [key: string]: string;
  }): string[] {
    const queryConditions: string[] = [];

    Object.keys(searchQuery).forEach((key) => {
      const values = searchQuery[key].split(' ');
      queryConditions.push(
        `${key} IN (${values.map((value) => `'${value}'`).join(', ')})`,
      );
    });

    return queryConditions;
  }
}
