import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs";

//provider in app.module as well

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const modifiedRequest = req.clone({headers: req.headers.append('Auth', 'my new value')});//the header has a second value. the "headers" after req comes from the old headers in posts
    return next.handle(modifiedRequest);/*for the execution to continue*/
  }
}

//you can control to what request you want to send the message to, recstricting it. req with an if statement for example
