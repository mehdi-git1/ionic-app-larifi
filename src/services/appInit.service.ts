import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';

@Injectable()
export class AppInitService {
    private initialized: boolean = false;

    constructor(private platform: Platform
        ) {
       
    };

    private init(): Observable<any> {
        return Observable.create(obs => {
            if (this.initialized == false) {
                this.platform.ready().then(() => {
                    this.initialized = true;
                    obs.next();
                    obs.complete();
                });
            } else {
                obs.next();
                obs.complete();
            }
        });
    }

    initFirstLaunch(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.init().subscribe(d => {
                
            });
        });
    }
}