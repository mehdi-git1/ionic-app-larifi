import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { ToastProvider } from '../providers/toast/toast';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastProvider: ToastProvider,
    private translateService: TranslateService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).do(evt => {

    }, err => {

      if (err instanceof HttpErrorResponse) {
        let errorMessage = this.translateService.instant('BACKEND_ERROR.UNKNOWN_ERROR');

        if (err.error.detailMessage !== undefined && err.error.label === 'BUSINESS_ERROR') {
          errorMessage = err.error.detailMessage;
        }

        this.toastProvider.error(`${this.translateService.instant('BACKEND_ERROR.LABEL')} ${err.status} : ${errorMessage}`);
      }
    });
  }
}
