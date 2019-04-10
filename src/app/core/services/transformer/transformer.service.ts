import { Injectable } from '@angular/core';

import { WaypointTransformerService } from '../waypoint/waypoint-transformer.service';
import { CareerObjectiveTransformerService } from '../career-objective/career-objective-transformer.service';
import { PncTransformerService } from '../pnc/pnc-transformer.service';
import { EntityEnum } from '../../enums/entity.enum';
import { EDossierPncObjectModel } from '../../models/e-dossier-pnc-object.model';

@Injectable()
export class TransformerService {

    constructor(
        private pncTransformer: PncTransformerService,
        private careerObjectiveTransformer: CareerObjectiveTransformerService,
        private waypointTransformer: WaypointTransformerService) {
    }
    /**
     * Appelle le bon transformer et transforme l'objet
     * @param type type de l'objet
     * @param objectToTransform objet a transformer
     */
    public transformObject(type: EntityEnum, objectToTransform: any): EDossierPncObjectModel {
        if (EntityEnum.PNC === type) {
            return this.pncTransformer.toPnc(objectToTransform);
        } else if (EntityEnum.CAREER_OBJECTIVE === type) {
            return this.careerObjectiveTransformer.toCareerObjective(objectToTransform);
        } else if (EntityEnum.WAYPOINT === type) {
            return this.waypointTransformer.toWaypoint(objectToTransform);
        } else {
            return objectToTransform;
        }
    }

    /**
     * Transform universellement les objects en leur bon type (Tableau d'objet)
     * @param typeOfObject Type d'objet à transformer (new()) permet de définir que c'est une classe utilisable en tant que tel
     * @param objectToTransform Objet à transformer
     */
    public universalTransformObjectArray(typeOfObject: { new() }, objectToTransform) {
        const objectArray = [];
        for (const object of objectToTransform) {
            objectArray.push(this.universalTransformObject(typeOfObject, object));
        }
        return objectArray;
    }

    /**
    * Transform universellement les objets en leur bon type (Tableau d'objet)
    * @param typeOfObject Type d'objet à transformer (new()) permet de définir que c'est une classe utilisable en tant que tel
    * @param objectToTransform Objet à transformer
    */
    public universalTransformObject(typeOfObject: { new() }, objectToTransform) {
        return !objectToTransform ?
            objectToTransform :
            new typeOfObject().fromJSON(objectToTransform);
    }
}
