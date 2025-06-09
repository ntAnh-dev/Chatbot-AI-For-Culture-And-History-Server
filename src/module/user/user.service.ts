import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(email: string) {
    const user = new this.userModel({
      email,
      conversationIds: [],
    });
    const result = await user.save();
    return result;
  }

  async updateUser(email: string, data: Partial<User>) {
    return this.userModel.findOneAndUpdate(
      { email },
      { $set: data },
      { new: true },
    );
  }

  async getUserByEmail(email) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getLoginCode(email) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }
    // Check is code valid
    if (this.isExpired(user.codeExpiryTime)) {
      const newCode = this.generateCode();
      user.code = newCode;
      user.codeExpiryTime = new Date();
      user.lastSentTime = new Date();
      await user.save();
    }
    return {
      code: user.code,
      lastSentTime: user.lastSentTime,
    };
  }

  async checkLoginCode(email: string, code: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user.code == code && !this.isExpired(user.codeExpiryTime);
  }

  private isExpired(codeExpiryTime: Date): boolean {
    if (!codeExpiryTime) return true;
    const now = new Date();
    const diffMs = now.getTime() - codeExpiryTime.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes > 30;
  }

  private generateCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }
}
