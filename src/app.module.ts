import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './module/chatbot/chatbot.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.NODEMAILER_HOST,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_APP_PASSWORD,
        },
      },
    }),
    MongooseModule.forRoot(
      'mongodb+srv://xanhduong309:PedPtm4XPceMP4HD@cluster0.7hinz73.mongodb.net/ChatbotDB?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ChatbotModule, 
    AuthModule, 
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// PedPtm4XPceMP4HD
// mongodb+srv://xanhduong309:PedPtm4XPceMP4HD@cluster0.7hinz73.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0