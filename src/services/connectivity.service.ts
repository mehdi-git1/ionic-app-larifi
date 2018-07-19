import { Config } from './../configuration/environment-variables/config';
import { Observable } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var window: any;

@Injectable()
export class ConnectivityService {

    private connected = true;

    @Output()
    connectionStatusChange = new EventEmitter<boolean>();

    constructor(protected http: HttpClient,
        public platform: Platform,
        private config: Config) {

        // ligne commentee temporairement car le ping cree des problèmes de connexion depuis l'app iPad.
        // On tombe sur la page d'authent habile (recup certificat)
        // TODO : a reactiver pour faire marcher le mode deconnecte
        // this.pingAPI();
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
        this.http.get(this.config.pingUrl, { observe: 'response' }).subscribe(
            success => {
                if (success.status === 200) {
                    this.setConnected(true);
                } else {
                    this.setConnected(false);
                }
            },
            error => {
                this.setConnected(false);
            });

        setTimeout(() => this.pingAPI(), 5000);
    }

    get isBrowser() {
        if ((window.device && window.device.platform === 'browser') || !this.platform.is('cordova')) {
            return true;
        } else {
            return false;
        }
    }

}
