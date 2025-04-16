import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ApiCallService } from './api-call.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './shema/message.schema';
import { Conversation, ConversationSchema } from './shema/conversation.schema';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, ApiCallService],
  exports: [ChatbotService],
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema }
    ]),
    HttpModule
  ]
})
export class ChatbotModule {}
