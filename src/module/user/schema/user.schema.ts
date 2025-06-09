import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  code: string;

  @Prop({ type: Date })
  lastSentTime: Date;

  @Prop({ type: Date })
  codeExpiryTime: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Conversation' }] })
  conversationIds: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
