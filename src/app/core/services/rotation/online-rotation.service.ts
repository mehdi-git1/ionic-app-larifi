import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { RotationModel } from '../../models/rotation.model';
import { LegModel } from '../../models/leg.model';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class OnlineRotationService {

    constructor(
        private restService: RestService,
        private config: UrlConfiguration
    ) { }

    /**
    * Récupère les tronçons d'une rotation
    * @param rotation la rotation dont on souhaite récupérer les tronçons
    * @return la liste des tronçons de la rotation
    */
    getRotationLegs(rotation: RotationModel): Promise<LegModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getRotationsByTechId', [rotation.techId]));
    }

}
