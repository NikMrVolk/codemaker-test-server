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

      console.log(searchQuery);

      try {
        const queryConditions: string[] = [];

        if (searchQuery.group) {
          const groupValues = searchQuery.group.split(' ');
          queryConditions.push(
            `group IN (${groupValues.map((value) => `'${value}'`).join(', ')})`,
          );
        }

        if (searchQuery.status) {
          const statusValues = searchQuery.status.split(' ');
          queryConditions.push(
            `status IN (${statusValues.map((value) => `'${value}'`).join(', ')})`,
          );
        }

        if (searchQuery.currency) {
          const currencyValues = searchQuery.currency.split(' ');
          queryConditions.push(
            `currency IN (${currencyValues.map((value) => `'${value}'`).join(', ')})`,
          );
        }

        const queryConditionString = queryConditions.join(' AND ');

        const querySQL = `
        SELECT id, login, \`group\`, status, currency, balance, bonus_balance, date_reg
        FROM users
        ${queryConditionString ? `WHERE ${queryConditionString.replace('group', '`group`')}` : ''}
        ORDER BY ${sort.field} ${sort.direction}
        LIMIT 10
      `;

        console.log(querySQL);

        const users = await db.query<UsersResponse>(querySQL);

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
