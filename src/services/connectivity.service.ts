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
            this.pingAPI();
        }
    }

    /**
     * Envoie une requête au backend toutes les 5 secondes pour vérifier la connectivité.
     */
    pingAPI() {
        this.restService.get(this.config.pingUrl).then(
            success => {
                console.log('connecté');
                this.setConnected(true);
                this.stopPingAPI();

                return true;
            },
            error => {
                console.log('déconnecté');
                this.setConnected(false);
                return true;
            });
        this.timer = setTimeout(() => this.pingAPI(), 5000);
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
