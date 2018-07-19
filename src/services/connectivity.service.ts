import { Config } from './../configuration/environment-variables/config';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { RestService } from './rest.base.service';

declare var window: any;

@Injectable()
export class ConnectivityService {

    private connected = true;

    @Output()
    connectionStatusChange = new EventEmitter<boolean>();

    constructor(public restService: RestService,
        private config: Config) {

        // ligne commentee temporairement car le ping cree des problèmes de connexion depuis l'app iPad.
        // On tombe sur la page d'authent habile (recup certificat)
        // TODO : a reactiver pour faire marcher le mode deconnecte
        this.pingAPI();
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


        setTimeout(() => this.pingAPI(), 5000);
    }


}
