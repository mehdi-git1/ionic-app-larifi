import { isUndefined } from 'ionic-angular/util/util';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { ToastService } from '../services/toast/toast.service';
import { Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { DeviceService } from '../services/device/device.service';
import { ConnectivityService } from '../services/connectivity/connectivity.service';
import { UrlConfiguration } from '../configuration/url.configuration';



@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastProvider: ToastService,
    private translateService: TranslateService,
    private connectivityService: ConnectivityService,
    private deviceService: DeviceService,
    private events: Events,
    private config: UrlConfiguration
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).do(success => {
    }, err => {

      if (err instanceof HttpErrorResponse && !request.url.includes(this.config.getBackEndUrl('getPing')) && !request.headers.has('BYPASS_INTERCEPTOR')) {

        let errorMessage = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');
        if (this.deviceService.isOfflineModeAvailable()) {
          // Bascule en mode déconnecté si le ping échoue
          return this.connectivityService.pingAPI().then(
            success => {
              if (err.error && !isUndefined(err.error.detailMessage) && err.error.label === 'BUSINESS_ERROR') {
                errorMessage = err.error.detailMessage;
              }
              this.toastProvider.error(errorMessage, 10000);
            },
            error => {
              this.events.publish('connectionStatus:disconnected');
            });
        } else {
          if (err.error && !isUndefined(err.error.detailMessage) && err.error.label === 'BUSINESS_ERROR') {
            errorMessage = err.error.detailMessage;
          }
          this.toastProvider.error(errorMessage, 10000);
        }
      }
    });
  }
}
