import { isUndefined } from 'ionic-angular/util/util';
import { DeviceService } from '../../../services/device.service';
import { SecurityProvider } from '../services/security/security';
import { ConnectivityService } from '../../../services/connectivity/connectivity.service';
import { SecMobilService } from '../../../services/secMobil.service';
import { Config } from '../../../configuration/environment-variables/config';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { ToastProvider } from '../services/toast/toast';
import { Events } from 'ionic-angular';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastProvider: ToastProvider,
    private translateService: TranslateService,
    private secMobilService: SecMobilService,
    private connectivityService: ConnectivityService,
    private deviceService: DeviceService,
    private events: Events,
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
              // TODO : tenter de relancer l'appel en offline
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
