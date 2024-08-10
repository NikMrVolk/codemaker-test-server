import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersSortFieldPipe } from './pipes/getUsersSortFieldPipe';
import { User } from './types';

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
      limit: number;
    },
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

    return this.usersService.getUsers(sort, search);
  }
}
