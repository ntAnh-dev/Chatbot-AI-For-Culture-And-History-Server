import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OptionalJwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/in')
  in(@Body() body: { email: string }) {
    return this.authService.toEmail(body.email);
  }

  @Post('/check')
  check(@Body() body: { email: string; code: string }) {
    return this.authService.authCheck(body.email, body.code);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/me')
  me(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return req.user;
    } else {
      return {
        message: 'guess',
      };
    }
  }
}
