import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IHttpResponse, IHttpStatus } from '@app/interfaces/http.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<IHttpResponse<T>> {
    const call$ = next.handle();
    return call$.pipe(map(data => this.toBaseResponse(data)));
  }

  toBaseResponse(data: any) {
    return {
      status: IHttpStatus.Success,
      message: '请求成功',
      data: data ? data : undefined,
    };
  }
}
