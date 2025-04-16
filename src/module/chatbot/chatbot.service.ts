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
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {}

  async getModels() {
    const route = '/model';
    const result = await this.apiCallService.callExternalApi('GET', apiUrl + route);
    return result;
  }

  async createConversation() {
    const conversation = new this.conversationModel({ name: uuidv4() });
    const result = await conversation.save();
    return result;
  }

  async deleteConversation(id) {
    const result = await this.conversationModel.deleteOne({ _id: id });
    return result;
  }

  async getConnversation(id) {
    const result = await this.conversationModel.findOne({ _id: id });
    const messages = await this.messageModel.find({ conversationId: id });
    return { messages };
  }

  async createMessage(model, conversationId, message) {
    const userInput = new this.messageModel({ conversationId, message, role: 'user' });
    await userInput.save();
    const response = await this.getOutput(model, message);
    const modelResponse = new this.messageModel({ conversationId, message: response?.answer, role: 'assistant' });
    await modelResponse.save();
    return ;
  }


  private async getOutput(model, input) {
    const route = '/question';
    const body = {
      model,
      question: input
    };
    const result = await this.apiCallService.callExternalApi('POST', apiUrl + route, body);
    return result;
  }
}
