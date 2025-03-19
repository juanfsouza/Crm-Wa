import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
  
      const status = exception.getStatus();
      const message = exception.message;
      const stack = exception.stack;
  
      // Log a more detailed error message
      this.logger.error(`Request failed: ${request.method} ${request.url}`);
      this.logger.error(`Status: ${status}`);
      this.logger.error(`Message: ${message}`);
      this.logger.error(`Stack Trace: ${stack}`);
  
      response.status(status).json({
        statusCode: status,
        message: message || 'Internal server error',
        error: exception.getResponse(),
      });
    }
  }