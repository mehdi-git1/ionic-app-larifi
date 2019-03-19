import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { SecMobilService } from './secMobil.service';
import { SessionService } from '../services/session/session.service';
import { RestWebService } from './rest/rest.web.service';
import { RestService } from './rest/rest.base.service';
import { RestMobileService } from './rest/rest.mobile.service';
import { HttpErrorInterceptor } from '../interceptor/http-error-interceptor.service';
import { Config } from '../../../environments/config';

declare var window: any;

@NgModule({
  imports: [],
  exports: [],
  providers: [
    SecMobilService,
    { provide: RestService, useFactory: createRestService, deps: [HttpClient, SessionService, SecMobilService, Config] },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    HttpClientModule,
  ]
})
export class HttpModule { }

// Check if we are in app mode or in web browser
export function createRestService(http: HttpClient, sessionService: SessionService, secMobilService: SecMobilService, config: Config): RestService {
  if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
    return new RestMobileService(http, secMobilService, config, sessionService);
  } else {
    return new RestWebService(http, config, sessionService);
  }
}
