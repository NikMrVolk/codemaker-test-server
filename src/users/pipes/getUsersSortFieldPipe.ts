import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Currency, User } from '../types';

const userFieldNames: User = {
  id: 0,
  login: '',
  group: 1,
  status: 1,
  currency: Currency.RUB,
  balance: 0,
  bonus_balance: 0,
  date_reg: new Date().toISOString(),
};

@Injectable()
export class GetUsersSortFieldPipe implements PipeTransform {
  constructor() {}

  async transform(value: {
    sortField: keyof User;
    sortDirection: 'asc' | 'desc';
    searchGroup?: string;
    searchStatus?: string;
    searchCurrency?: string;
    limit?: number;
    accessToken: string;
  }) {
    const { sortField, sortDirection } = value;

    if (!Object.keys(userFieldNames).includes(sortField)) {
      throw new BadRequestException('Invalid sortField');
    }

    if (!['asc', 'desc'].includes(sortDirection)) {
      throw new BadRequestException('Invalid sortDirection');
    }

    return value;
  }
}
