import 'rxjs/add/operator/do';

import { Observable } from 'rxjs/Observable';

import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UrlConfiguration } from '../configuration/url.configuration';
import { ConnectivityService } from '../services/connectivity/connectivity.service';
import { DeviceService } from '../services/device/device.service';
import { ToastService } from '../services/toast/toast.service';

@Injectable({ providedIn: 'root' })
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

      if (err instanceof HttpErrorResponse && !request.url.includes(this.config.getBackEndUrl('getPing'))) {

        let errorMessage = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');
        if (this.deviceService.isOfflineModeAvailable()) {
          // Bascule en mode déconnecté si le ping échoue
          return this.connectivityService.pingAPI().then(
            success => {
              if (err.error && err.error.detailMessage !== undefined && err.error.label === 'BUSINESS_ERROR') {
                errorMessage = err.error.detailMessage;
              }
              if (request.headers && !request.headers.has('BYPASS_INTERCEPTOR')) {
                this.toastProvider.error(errorMessage, 10000);
              }
            },
            error => {
              this.events.publish('connectionStatus:disconnected');
            });
        } else {
          if (err.error && err.error.detailMessage !== undefined && err.error.label === 'BUSINESS_ERROR') {
            errorMessage = err.error.detailMessage;
          }
          if (request.headers && !request.headers.has('BYPASS_INTERCEPTOR')) {
            this.toastProvider.error(errorMessage, 10000);
          }
        }
      }
    });
  }
}
