import { WaypointTransformerProvider } from './../providers/waypoint/waypoint-transformer';
import { CareerObjectiveTransformerProvider } from './../providers/career-objective/career-objective-transformer';
import { PncTransformerProvider } from './../providers/pnc/pnc-transformer';
import { Entity } from './../models/entity';
import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../models/eDossierPncObject';

@Injectable()
export class TransformerService {

    constructor(
        private pncTransformer: PncTransformerProvider,
        private careerObjectiveTransformer: CareerObjectiveTransformerProvider,
        private waypointTransformer: WaypointTransformerProvider) {
    }
    /**
     * Appelle le bon transformer et transforme l'objet
     * @param type type de l'objet
     * @param objectToTransform objet a transformer
     */
    public transformObject(type: Entity, objectToTransform: any): EDossierPncObject {
        if (Entity.PNC === type) {
            return this.pncTransformer.toPnc(objectToTransform);
        } else if (Entity.CAREER_OBJECTIVE === type) {
            return this.careerObjectiveTransformer.toCareerObjective(objectToTransform);
        } else if (Entity.WAYPOINT === type) {
            return this.waypointTransformer.toWaypoint(objectToTransform);
        } else {
            return objectToTransform;
        }
    }
}
