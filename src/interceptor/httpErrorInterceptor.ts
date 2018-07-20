import { ConnectivityService } from './../services/connectivity.service';
import { Config } from './../configuration/environment-variables/config';
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
    private translateService: TranslateService,
    private connectivityService: ConnectivityService,
    private config: Config
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).do(success => {

    }, err => {

      if (err instanceof HttpErrorResponse && request.url !== this.config.pingUrl) {
        let errorMessage = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');

        if (err.error.detailMessage !== undefined && err.error.label === 'BUSINESS_ERROR') {
          errorMessage = err.error.detailMessage;
        }

        this.toastProvider.error(errorMessage);
      }
    });
  }
}
