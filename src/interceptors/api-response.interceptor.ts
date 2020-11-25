export class ApiResponse {
  sc: number;
  data: any;
  error: any;
  time: number;
  constructor(sc, result) {
    this.sc = sc;
    this.sc === 1 ? this.data = result : this.error = result;
    this.time = Date.now();
  }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const req = context.switchToHttp().getRequest();
 
    // do this after hitting request
    // transform success response
    return next.handle().pipe(map(data => (new ApiResponse(1, data))));
  }
}