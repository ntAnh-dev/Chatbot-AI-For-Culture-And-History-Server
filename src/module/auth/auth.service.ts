import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async toEmail(email: string) {
    const exists = await this.userService.getUserByEmail(email);
    if (!exists) await this.userService.createUser(email);
    const verifyInfo = await this.userService.getLoginCode(email);
    await this.sendMail(email, verifyInfo.code);
    if (this.isExpired(verifyInfo.lastSentTime)) {
      await this.userService.updateUser(email, {
        lastSentTime: new Date(),
      });
    }
    return;
  }

  async authCheck(email: string, code: string) {
    const exists = await this.userService.getUserByEmail(email);
    if (!exists) {
      throw new UnauthorizedException();
    }
    if (exists.code !== code) {
      throw new UnauthorizedException();
    }
    const payload = { email: email, sub: exists._id };
    return {
      email: email,
      access_token: this.jwtService.sign(payload),
    };
  }

  private async sendMail(to: string, code: string) {
    await this.mailerService.sendMail({
      from: 'Chatbot AI For Culture and History',
      to,
      subject: 'Your Verification Code',
      html: `<p>Your code is: <b>${code}</b></p>`,
    });
  }

  private isExpired(codeExpiryTime: Date): boolean {
    const now = new Date();
    const diffMs = now.getTime() - codeExpiryTime.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes > 30;
  }
}
