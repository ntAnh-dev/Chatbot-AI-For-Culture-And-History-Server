import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { OptionalJwtAuthGuard } from '../auth/jwt.guard';

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

  @UseGuards(OptionalJwtAuthGuard)
  @Post('/conversation')
  createConversation(@Req() req, @Body() body) {
    return this.chatbotService.createConversation(body, req.user);
  }

  @Post('/message')
  createMessage(@Body() body) {
    return this.chatbotService.createMessage(
      body.conversationId,
      body.message,
    );
  }

  @Delete('/conversation/:id')
  deleteConversation(@Param('id') id: string) {
    return this.chatbotService.deleteConversation(id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/conversations')
  getConversations(@Req() req) {
    return this.chatbotService.getConversationByUserId(req.user._id);
  }
}
