import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  extra?: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);