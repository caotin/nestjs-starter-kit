import { BadRequestException } from '@nestjs/common';
import { MessageError, MessageName } from '@/message';

export class ExpiredException extends BadRequestException {
  constructor(text: MessageName) {
    super(MessageError.EXPIRED(text));
  }
}
