import { Config } from './../configuration/environment-variables/config';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { RestService } from './rest.base.service';

declare var window: any;

@Injectable()
export class ConnectivityService {

    private connected = true;
    /**
     * La variable timer permet de gére le timer du pingAPI
     * Et ainsi de pouvoir le stopper si on récupére le réseau
     */
    private timer;

    @Output()
    connectionStatusChange = new EventEmitter<boolean>();

    constructor(public restService: RestService,
        private config: Config) {
        this.timer = 0;
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
     * appelle la fonction de ping en s'assurant qu'aucun ping n'est pas lancé avant.
     */
    startPingAPI() {
        if (this.timer === 0) {
            this.loopPingAPI();
        }
    }

    /**
     * Appelle le ping toutes les 5 secondes pour vérifier la connectivité.
     */
    loopPingAPI() {
        this.pingAPI().then(
            success => {
                this.setConnected(true);
                this.stopPingAPI();

                return true;
            }, error => {
                this.setConnected(false);
                return true;
            });
        this.timer = setTimeout(() => this.loopPingAPI(), 5000);
    }

    /**
     * Envoie une requête au backend pour vérifier la connectivité.
     */
    pingAPI(): Promise<any> {
        return this.restService.get(this.config.pingUrl);
    }

    /**
     * Fonction permettant de forcer l'arrêt du ping toutes les 5 secondes
     * On clear le timeOut et on réinitialise sa valeur à celle par défaut
     */
    stopPingAPI() {
        clearTimeout(this.timer);
        this.timer = 0;
    }


}
