import { Injectable } from '@nestjs/common';
import { ApiCallService } from './api-call.service';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './shema/message.schema';
import { Model } from 'mongoose';
import { Conversation } from './shema/conversation.schema';
import { v4 as uuidv4 } from 'uuid';

const apiUrl = 'http://localhost:8000';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly apiCallService: ApiCallService,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async getModels() {
    const route = '/model';
    const result = await this.apiCallService.callExternalApi(
      'GET',
      apiUrl + route,
    );
    return result;
  }

  async createConversation(data, user) {
    if (user) {
      const conversation = new this.conversationModel({
        name: data.firstMessage,
        userId: user._id ?? null,
      });
      const result = await conversation.save();
      return result;
    } else {
      const conversation = new this.conversationModel({
        name: data.firstMessage
      });
      const result = await conversation.save();
      return result;
    }
  }

  async deleteConversation(id) {
    await this.messageModel.deleteMany({ conversationId: id });
    const result = await this.conversationModel.deleteOne({ _id: id });
    return result;
  }

  async getConnversation(id) {
    const messages = await this.messageModel.find({ conversationId: id });
    return { messages };
  }

  async getConversationByUserId(userId) {
    return this.conversationModel.find({ userId });
  }

  async createMessage(conversationId, message) {
    const lastItem = await this.messageModel
      .findOne({ conversationId })
      .sort({ createAt: -1 })
      .exec();

    const lastMessage = lastItem ? lastItem.message : '';

    const userInput = new this.messageModel({
      conversationId,
      message,
      role: 'user',
    });
    await userInput.save();

    // Xử lý bất đồng bộ phần lấy câu trả lời
    this.handleAssistantResponse(conversationId, message, lastMessage);

    // Trả lại ngay message của user
    return userInput;
  }

  async handleAssistantResponse(conversationId: string, message: string, extra: string) {
    try {
      const response = await this.getOutput(message, extra);
      const modelResponse = new this.messageModel({
        conversationId,
        message: response?.answer,
        extra: response?.extra_questions,
        role: 'assistant',
      });
      await modelResponse.save();
    } catch (err) {
      console.error("Error generating assistant response:", err);
      // Optionally lưu log hoặc message lỗi vào DB
    }
  }


  private async getOutput(input, extra) {
    const route = '/question';
    const body = {
      question: input,
      extra
    };
    const result = await this.apiCallService.callExternalApi(
      'POST',
      apiUrl + route,
      body,
    );
    return result;
  }
}
