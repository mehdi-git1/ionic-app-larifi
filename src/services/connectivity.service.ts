import { Config } from './../configuration/environment-variables/config';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { RestService } from './rest.base.service';

declare var window: any;

@Injectable()
export class ConnectivityService {

    private connected = true;
    private timer = 0;

    @Output()
    connectionStatusChange = new EventEmitter<boolean>();

    constructor(public restService: RestService,
        private config: Config) {
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

    /**
     * Envoie une requête au backend toutes les 5 secondes pour vérifier la connectivité.
     */
    pingAPI() {
        this.restService.get(this.config.pingUrl).then(
            success => {
                this.setConnected(true);
            },
            error => {
                this.setConnected(false);
            });

        this.timer = setTimeout(() => this.pingAPI(), 5000);
    }

    stopPingApi(){
        clearTimeout(this.timer);
        this.timer = 0;
    }


}
