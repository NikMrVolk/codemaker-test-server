import { Controller, Get, Query, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersSortFieldPipe } from './pipes/getUsersSortFieldPipe';
import { User } from './types';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query(GetUsersSortFieldPipe)
    query: {
      sortField: keyof User;
      sortDirection: 'asc' | 'desc';
      searchGroup: string;
      searchStatus: string;
      searchCurrency: string;
      take: number;
      skip: number;
    },
    @Res() res: Response,
  ) {
    const sort = {
      field: query.sortField || 'id',
      direction: query.sortDirection || 'desc',
    };

    const search = {
      group: query.searchGroup,
      status: query.searchStatus,
      currency: query.searchCurrency,
    };

    const { users, totalCount } = await this.usersService.getUsers(
      sort,
      search,
      query.take,
      query.skip,
    );

    if (totalCount) {
      res.header('Access-Control-Expose-Headers', 'X-Total-Count');
      res.header('X-Total-Count', totalCount.toString());
    }

    return users;
  }
}
