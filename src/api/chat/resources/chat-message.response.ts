import { Expose, Transform } from 'class-transformer';
import { dateToTimestamp } from 'src/common/helper/common.helper';

export class ChatMessageResponse {
  @Expose()
  readonly messageId: number;

  @Expose()
  readonly message: string;

  @Expose()
  readonly messageType: string;

  @Expose()
  readonly chatId: number;

  @Expose()
  readonly senderId: number;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  readonly createdAt: number;

  @Expose()
  readonly isSeen: boolean;
}
