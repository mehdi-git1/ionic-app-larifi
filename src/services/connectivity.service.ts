import { Observable } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var window: any;

@Injectable()
export class ConnectivityService {

    private restBaseUrl: 'https://secmobil-apirct.airfrance.fr/secmobilTestWeb/services/api/user/';
    public isConnected = false;

    @Output()
    public connectionStatusChange = new EventEmitter<boolean>();

    constructor(protected http: HttpClient,
        public platform: Platform) {
        // console.log('constructor');
        this.checkConnection();
    }

    setConnected(newStatus: boolean) {

        if (this.isConnected !== newStatus) {
            this.isConnected = newStatus;
            this.connectionStatusChange.emit(newStatus);
        }
    }

    public checkConnection() {
        // console.log('check connection');
        this.pingAPI().subscribe(p => {
            if (p) {
                this.setConnected(true);
                // console.log('connected');
            } else {
                this.setConnected(false);
                // console.log('not connected');
            }
        });

        setTimeout(() => this.checkConnection(), 5000);
    }

    pingAPI(): Observable<Boolean> {
        return Observable.create(
            observer => {
                this.http.get(this.restBaseUrl, { observe: 'response' }).subscribe(
                    r => {
                        if (r.status === 200) {
                            observer.next(true);
                            observer.complete();
                        } else {
                            observer.next(false);
                            observer.complete();
                        }
                    }, (error) => {
                        observer.next(false);
                        observer.complete();
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
