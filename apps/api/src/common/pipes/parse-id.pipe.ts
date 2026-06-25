import { ParseUUIDPipe, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ParseIdPipe extends ParseUUIDPipe {
  constructor() {
    super({
      version: '4',
      exceptionFactory: () => {
        return new BadRequestException(
          'O ID fornecido deve ser um UUID válido.',
        );
      },
    });
  }
}
