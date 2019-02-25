import { Config } from './../../../../environments/dev';
import { HttpClient } from '@angular/common/http';
import { BackgroundRequest } from './background-request';
import { RestRequest } from './rest-request';
import { RestService } from './rest.base.service';
import { Injectable, EventEmitter } from '@angular/core';
import { SessionService } from '../../services/session/session.service';

@Injectable()
export class RestBackgroundService extends RestService {

  MAX_CONCURRENT_REQUEST = 5;
  concurrentRequestCount = 0;

  requestCountChange = new EventEmitter<number>();
  progressChange = new EventEmitter<number>();

  requestPool = new Array<BackgroundRequest>();

  processedRequest = 0;

  constructor(
    protected http: HttpClient,
    protected config: Config,
    protected sessionService: SessionService,
    protected restService: RestService) {
    super(http, sessionService, config);
  }

  public call(request: RestRequest): Promise<any> {
    const backgroundRequest = new BackgroundRequest();
    backgroundRequest.promise = new Promise((resolveCallBack, rejectCallback) => {
      backgroundRequest.resolve = resolveCallBack;
      backgroundRequest.reject = rejectCallback;
    });
    backgroundRequest.request = request;
    this.requestPool.push(backgroundRequest);
    // Dès qu'on alimente le pool, le compteur de requête revient à 0 afin d'avoir un calcul de la progression (pourcentage) cohérent
    this.processedRequest = 0;

    this.processRequestPool();

    return backgroundRequest.promise;
  }

  private processRequestPool(): void {
    if (this.concurrentRequestCount < this.MAX_CONCURRENT_REQUEST) {
      if (this.requestPool.length > 0) {
        this.processRequest(this.requestPool.shift());
      } else {
        this.processedRequest = 0;
        this.concurrentRequestCount = 0;
      }
    }
  }

  private processRequest(backgroundRequest: BackgroundRequest): void {
    this.concurrentRequestCount++;
    this.updateProgress();
    this.restService.sendDeferedRequest(backgroundRequest.request).then(success => {
      backgroundRequest.resolve(success);
    }, error => {
      backgroundRequest.reject(error);
    }).then(() => {
      // Finally
      this.concurrentRequestCount--;
      this.processRequestPool();
    });
  }

  private updateProgress() {
    this.processedRequest++;
    this.requestCountChange.emit(this.requestPool.length);
    this.progressChange.emit(Math.round((this.processedRequest / this.requestPool.length) * 100));
  }

}


