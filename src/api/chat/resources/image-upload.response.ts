import { Expose } from 'class-transformer';

export class ImageUploadResource {
  @Expose()
  readonly data: string;
}
