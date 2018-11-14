import { Injectable } from '@angular/core';

import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { RestService } from '../../services/rest/rest.base.service';

@Injectable()
export class OnlineRotationProvider {

    constructor(
        private restService: RestService,
        private config: Config
    ) { }

    /**
    * Récupère les tronçons d'une rotation
    * @param rotation la rotation dont on souhaite récupérer les tronçons
    * @return la liste des tronçons de la rotation
    */
    getRotationLegs(rotation: Rotation): Promise<Leg[]> {
        return this.restService.get(this.config.getBackEndUrl('getRotationsByTechId', [rotation.techId]));
    }

}
