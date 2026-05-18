import { ArgumentsHost } from '@nestjs/common';
import { ProjectAlreadyExistsException } from '../exceptions/project-already-exists.exception';
import { ProjectAlreadyExistsFilter } from './project-already-exists.filter';

describe('ProjectAlreadyExistsFilter', () => {
  let filter: ProjectAlreadyExistsFilter;

  beforeEach(() => {
    filter = new ProjectAlreadyExistsFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch ProjectAlreadyExistsException and return custom JSON response', () => {
    const mockRequest = {
      method: 'POST',
      url: '/projects',
    };

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

    const exception = new ProjectAlreadyExistsException('Letzify');

    filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp).toHaveBeenCalled();
    expect(mockHttp.getRequest).toHaveBeenCalled();
    expect(mockHttp.getResponse).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errorCode: 'PROJECT_ALREADY_EXISTS',
        message: 'Operação negada: Já existe um projeto cadastrado com o nome "Letzify".',
        path: '/projects',
      }),
    );
  });
});
