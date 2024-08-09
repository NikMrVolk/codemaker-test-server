export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
}

export type User = {
  id: number;
  login: string;
  group: number;
  status: number;
  currency: Currency;
  balance: number;
  bonus_balance: number;
  date_reg: string;
};

export type UsersResponse = User[];
