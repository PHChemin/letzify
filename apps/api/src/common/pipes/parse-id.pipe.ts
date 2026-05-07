import { ParseIntPipe, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ParseIdPipe extends ParseIntPipe {
    constructor() {
        super({
            exceptionFactory: () => {
                return new BadRequestException('O ID fornecido deve ser um número inteiro válido.');
            },
        });
    }
}
