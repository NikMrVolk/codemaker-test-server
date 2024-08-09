import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DBService {
  async connectToDatabase({
    host,
    port,
    username,
    password,
    database,
  }: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }) {
    const dataSource = new DataSource({
      type: 'mysql',
      host,
      port,
      username,
      password,
      database,
    });

    await dataSource.initialize();

    return dataSource;
  }
}
