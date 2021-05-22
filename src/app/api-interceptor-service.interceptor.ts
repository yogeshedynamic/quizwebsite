import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';

import { Observable, throwError, from } from 'rxjs';
import { finalize, tap, map, catchError  } from 'rxjs/operators';
import { AuthserviceService } from './authservice.service';

@Injectable()
export class ApiInterceptorServiceInterceptor implements HttpInterceptor {

  constructor(private AS:AuthserviceService) {}

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   return next.handle(request);
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler):   Observable<HttpEvent<any>> {
    // All HTTP requests are going to go through this method
    return from(this.handleAccess(req, next));

  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler):
      Promise<HttpEvent<any>> {
      let token;
      let session = await this.AS.sessionCTRL('get');
      if(!!session){
        token = session ;
      }else{
        token = "loginAsGuest";
      }

      console.log('Interceptor Token: ',token);
      // Finally we have to clone our request with our new headers
      // This is required because HttpRequests are immutable


        let newHeaders = req.headers;
        
        if(req.url.indexOf('zoho') == -1){
            newHeaders = newHeaders.append('auth-token', token);
        }
        
        const authReq = req.clone({headers: newHeaders});
        // Then we return an Observable that will run the request
        // or pass it to the next interceptor if any


        return next.handle(authReq).pipe(
          // We use the map operator to change the data from the response
          map(resp => {
            // Several HTTP events go through that Observable 
            // so we make sure that this is a HTTP response
            if (resp instanceof HttpResponse) {
                // Just like for request, we create a clone of the response
                // and make changes to it, then return that clone     
                //return  resp.clone({ body: [{title: 'Replaced data in interceptor'}] });
                return  resp;
            }
          })
        ).toPromise();

      
      



  }





}
