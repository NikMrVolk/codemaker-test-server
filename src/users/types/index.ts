type User = {
  id: number;
  login: string;
  group: number;
  status: number;
  currency: string;
  balance: number;
  bonus_balance: number;
  date_reg: string;
};

export type UsersResponse = User[];
