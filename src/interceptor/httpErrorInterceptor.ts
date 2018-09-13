import { DeviceService } from './../services/device.service';
import { SecurityProvider } from './../providers/security/security';
import { ConnectivityService } from './../services/connectivity.service';
import { SecMobilService } from './../services/secMobil.service';
import { Config } from './../configuration/environment-variables/config';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { ToastProvider } from '../providers/toast/toast';
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

        // Bascule en mode déconnecté si le ping échoue
        if (this.deviceService.isOfflineModeAvailable()) {
          return this.connectivityService.pingAPI().then(
            success => {
              let errorMessage = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');

              if (err.error.detailMessage !== undefined && err.error.label === 'BUSINESS_ERROR') {
                errorMessage = err.error.detailMessage;
              }

              return errorMessage;

            },
            error => {
              // TODO : tenter de relancer l'appel en offline
              // this.events.publish('connectionStatus:disconnected');
              return 'disconnected';
            });
        }
      }
    });
  }
}
