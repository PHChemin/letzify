import { ValidationPipe, BadRequestException } from '@nestjs/common';

export const validationPipeConfig = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors) => {
    const messages = errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));
    return new BadRequestException(messages);
  },
});
