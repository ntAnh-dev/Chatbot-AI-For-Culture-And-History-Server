import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('/models')
  getModels() {
    return this.chatbotService.getModels();
  }

  @Get('/conversation/:id')
  getConversation(@Param('id') id: string) {
    return this.chatbotService.getConnversation(id);
  }

  @Post('/conversation')
  createConversation() {
    return this.chatbotService.createConversation();
  }

  @Post('/message')
  createMessage(@Body() body) {
    return this.chatbotService.createMessage(body.model, body.conversationId, body.message);
  }
}
