import { Body, Controller, Post, Req, Ip, Param, Delete } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admins')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Ip() ip: string) {
    const userAgent = req.headers['user-agent'];
    const ipv4 = ip === '::1' ? process.env.CURRENT_IP : ip;

    return this.authService.login(dto, ipv4, userAgent);
  }

  @Delete('logout/:id')
  async deleteDbInfoFromDB(@Param('id') id: string) {
    return this.authService.deleteDataFromCache(id);
  }
}
