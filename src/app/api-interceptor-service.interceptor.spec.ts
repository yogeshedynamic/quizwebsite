import { TestBed } from '@angular/core/testing';

import { ApiInterceptorServiceInterceptor } from './api-interceptor-service.interceptor';

describe('ApiInterceptorServiceInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiInterceptorServiceInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiInterceptorServiceInterceptor = TestBed.inject(ApiInterceptorServiceInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
