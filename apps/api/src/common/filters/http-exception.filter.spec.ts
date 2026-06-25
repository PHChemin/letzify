import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, BadRequestException } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });

  it('should format HttpException responses using the global contract', () => {
    const filter = new HttpExceptionFilter();

    const mockRequest = { url: '/projects' };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const mockHttp = {
      getRequest: jest.fn().mockReturnValue(mockRequest),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    };

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttp),
    } as unknown as ArgumentsHost;

    filter.catch(new BadRequestException('Dados inválidos'), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: '/projects',
        message: 'Dados inválidos',
        timestamp: expect.any(String),
      }),
    );
  });
});
