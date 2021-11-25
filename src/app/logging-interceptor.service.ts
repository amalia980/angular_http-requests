//mulitple interceptors

import { HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest } from "@angular/common/http";
import { tap } from "rxjs";

export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("Outgoing request!");
    console.log(req.url);//if you want
    return next.handle(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {/*checking the response*/
          console.log("Incoming response");
          console.log(event.body);
        }
      })
    );
  }
}
