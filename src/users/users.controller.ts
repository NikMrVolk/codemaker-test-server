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
    },
  ) {
    const sort = {
      field: query.sortField || 'id',
      direction: query.sortDirection || 'desc',
    };

    return this.usersService.getUsers(sort);
  }
}
