import { HttpException, HttpStatus } from '@nestjs/common';

export class ProjectAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(
      `Operação negada: Já existe um projeto cadastrado com o nome "${name}".`,
      HttpStatus.CONFLICT,
    );
  }
}
