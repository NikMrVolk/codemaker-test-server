type LoginErrorResponse = {
  error: number;
  message: string;
};

type LoginCasinoResponse = {
  id: number;
  name: string;
};

type LoginDBResponse = {
  host: string;
  username: string;
  pass: string;
  database: string;
};

type LoginUserResponse = {
  id: number;
  group: number;
  login: string;
};

type LoginSuccessResponse = {
  casino: LoginCasinoResponse;
  db: LoginDBResponse;
  user: LoginUserResponse;
};

export type LoginResponse = LoginErrorResponse | LoginSuccessResponse;
