import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

export class NotAuthenticatedError { }

@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isOauthRequest(request)) {
      return next.handle(request);
    }

    if (this.isRequestAnexo(request)) {
      return this.doRequestAnexo(request, next);
    }

    if (this.auth.isAccessTokenInvalido()) {
      return this.doRequestRefreshToken(request, next);
    }

    return this.doRequestWithToken(request, next);
  }

  private isOauthRequest(request: HttpRequest<any>) {
    return request.url.includes('/oauth/token');
  }

  private isRequestAnexo(request: HttpRequest<any>) {

    return request.url.includes('/lancamentos/anexo');
  }


  private doRequestAnexo(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (this.auth.isAccessTokenInvalido()) {
      return this.doRequestAnexoRefreshToken(request, next);
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(request);
  }

  private doRequestWithToken(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    request = request.clone({
      setHeaders: {
        Accept: `application/json`,
        'Content-Type': `application/json`,
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(request);
  }
  // metodo doRequestWithToken criar requisição especifica para enviar o token renovado
  // para qualquer requisição que nao seja para url /oauth/token e lancamentos/anexo
  private doRequestRefreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.auth.obterNovoAccessToken())
      .pipe(
        switchMap(() => this.doRequestWithToken(request, next)),
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return throwError(new NotAuthenticatedError());
          }

          return throwError(error);
        })
      );
  }

  private doRequestAnexoWithToken(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(request);
  }

  // Metodo doRequestAnexoRefreshToken cria requisição especifica para enviar o token
  // renovado em uma requisição feita para url lancamentos/anexo
  private doRequestAnexoRefreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.auth.obterNovoAccessToken())
      .pipe(
        switchMap(() => this.doRequestAnexoWithToken(request, next)),
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return throwError(new NotAuthenticatedError());
          }

          return throwError(error);
        })
      );
  }

}
