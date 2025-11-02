import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (!(<any>host)?.args[0].rawHeaders.includes('Api-Key')) {
      exception.response.error = 'Unauthorized';
      exception.response.message = 'ERROR: API key is missing or invalid';
      super.catch(exception, host);
    }

    if (
      exception.response &&
      exception.response.message &&
      typeof exception.response.message === 'object'
    ) {
      exception.response.message = exception.response.message[0];
    }
    super.catch(exception, host);
  }
}
