import { Observable } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var window: any;

@Injectable()
export class ConnectivityService {

    // private restBaseUrl: 'https://secmobil-apirct.airfrance.fr/secmobilTestWeb/services/api/user/';
    private pingUrl: 'http://localhost:8080/api/resources/rest/me';
    private connected = false;

    @Output()
    connectionStatusChange = new EventEmitter<boolean>();

    constructor(protected http: HttpClient,
        public platform: Platform) {

        this.checkConnection();
    }

    getPingUrl() {
        return this.pingUrl;
    }

    isConnected(): boolean {
        return this.connected;
    }

    setConnected(newStatus: boolean) {
        if (this.connected !== newStatus) {
            this.connected = newStatus;
            this.connectionStatusChange.emit(newStatus);
        }
    }

    checkConnection() {
        // console.log('check connection');
        this.pingAPI().subscribe(pingResult => {
            if (pingResult) {
                this.setConnected(true);
                console.log('connected');
            } else {
                this.setConnected(false);
                console.log('not connected');
            }
        });

        setTimeout(() => this.checkConnection(), 5000);
    }

    pingAPI(): Observable<Boolean> {
        return Observable.create(
            pingResultStream => {
                this.http.get(this.pingUrl, { observe: 'response' }).subscribe(
                    response => {
                        if (response.status === 200) {
                            pingResultStream.next(true);
                            pingResultStream.complete();
                        } else {
                            pingResultStream.next(false);
                            pingResultStream.complete();
                        }
                    },
                    error => {
                        pingResultStream.next(false);
                        pingResultStream.complete();
                    });
            }
        );
    }

    get isBrowser() {
        if ((window.device && window.device.platform === 'browser') || !this.platform.is('cordova')) {
            return true;
        } else {
            return false;
        }
    }

}
