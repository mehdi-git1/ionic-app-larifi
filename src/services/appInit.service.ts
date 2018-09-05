import { SessionService } from './session.service';
import { ParametersProvider } from './../providers/parameters/parameters';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';


@Injectable()
export class AppInitService {


    constructor(
        private parametersProvider: ParametersProvider,
        private sessionService: SessionService,
        private events: Events
    ) {

    }

      /**
     * Récupère les parametres envoyé par le back
     */
    initParameters() {
        this.parametersProvider.getParams().then(parameters => {
            this.sessionService.parameters = parameters;
            this.events.publish('parameters:ready');
        }, error => { });
    }

}
