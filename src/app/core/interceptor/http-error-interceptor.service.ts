import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UrlConfiguration } from '../configuration/url.configuration';
import { ConnectivityService } from '../services/connectivity/connectivity.service';
import { DeviceService } from '../services/device/device.service';
import { Events } from '../services/events/events.service';
import { ToastService } from '../services/toast/toast.service';
import { AlertDialogService } from '../services/alertDialog/alert-dialog.service';

@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastProvider: ToastService,
    private translateService: TranslateService,
    private connectivityService: ConnectivityService,
    private deviceService: DeviceService,
    private events: Events,
    private config: UrlConfiguration,
    private alertDialogService: AlertDialogService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(success => {
    }, err => {

      if (err instanceof HttpErrorResponse && !request.url.includes(this.config.getBackEndUrl('getPing'))) {

        let errorMessage = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');

        /*
         Ce statut indique que la version actuelle est archivée,
         un pop-up bloquant est affiché pour obliger l'utilisateur
         à mettre à jour l'application
         */
        if (err.status == 410) {
          this.alertDialogService.openAlertDialog(this.translateService.instant('GLOBAL.APP_VERSION.DEPRECATED_VERSION_ALERT.TITLE'),
            this.translateService.instant('GLOBAL.APP_VERSION.DEPRECATED_VERSION_ALERT.MESSAGE'), '', '', 'deprecated-app-version-alert', false);
        }
        else {
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
          }
          else {
            if (err.error && err.error.detailMessage !== undefined && err.error.label === 'BUSINESS_ERROR') {
              errorMessage = err.error.detailMessage;
            }
            if (request.headers && !request.headers.has('BYPASS_INTERCEPTOR')) {
              this.toastProvider.error(errorMessage, 10000);
            }
          }
        }
      }
    }));
  }
}
