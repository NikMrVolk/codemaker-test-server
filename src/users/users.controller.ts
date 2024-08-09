import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query('sortField') sortField: keyof User,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
  ) {
    const sort = {
      field: sortField || 'id',
      direction: sortDirection || 'desc',
    };
    return this.usersService.getUsers(sort);
  }
}
