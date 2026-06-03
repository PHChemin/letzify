import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProjectAlreadyExistsException } from '../exceptions/project-already-exists.exception';

@Catch(ProjectAlreadyExistsException)
export class ProjectAlreadyExistsFilter implements ExceptionFilter {
  // Instanciando o Logger com o nome da classe para facilitar a rastreabilidade
  private readonly logger = new Logger(ProjectAlreadyExistsFilter.name);

  catch(exception: ProjectAlreadyExistsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    // REGISTRO DE LOG: Avisando a equipe de backend sobre a falha da regra de negócio
    this.logger.warn(
      `[${request.method}] ${request.url} - Tentativa de criação de projeto duplicado detectada.`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
