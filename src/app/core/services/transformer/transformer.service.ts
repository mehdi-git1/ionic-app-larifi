import { Injectable } from '@angular/core';

import { WaypointTransformerService } from '../waypoint/waypoint-transformer.service';
import { CareerObjectiveTransformerService } from '../career-objective/career-objective-transformer.service';
import { PncTransformerService } from '../pnc/pnc-transformer.service';
import { EntityEnum } from '../../enums/entity.enum';
import { EDossierPncObjectModel } from '../../models/e-dossier-pnc-object.model';
import { SummarySheetTransformerService } from '../summary-sheet/summary-sheet-transformer.service';

@Injectable()
export class TransformerService {

    constructor(
        private pncTransformer: PncTransformerService,
        private careerObjectiveTransformer: CareerObjectiveTransformerService,
        private waypointTransformer: WaypointTransformerService,
        private summarySheetTransformer: SummarySheetTransformerService) {
    }
    /**
     * Appelle le bon transformer et transforme l'objet
     * @param type type de l'objet
     * @param objectToTransform objet a transformer
     */
    public transformObject(type: EntityEnum, objectToTransform: any): EDossierPncObjectModel {
        if (EntityEnum.PNC === type) {
            return this.pncTransformer.toPnc(objectToTransform);
        } else if (EntityEnum.SUMMARY_SHEET === type) {
            return this.summarySheetTransformer.toSummarySheet(objectToTransform);
        } else if (EntityEnum.CAREER_OBJECTIVE === type) {
            return this.careerObjectiveTransformer.toCareerObjective(objectToTransform);
        } else if (EntityEnum.WAYPOINT === type) {
            return this.waypointTransformer.toWaypoint(objectToTransform);
        } else {
            return objectToTransform;
        }
    }

    public universalTransformObjectArray(typeOfObject: { new() }, objectToTransform) {
        const objectArray = [];
        for (const object of objectToTransform) {
            objectArray.push(this.universalTransformObject(typeOfObject, object));
        }
        console.log(objectArray);
        return objectArray;
    }

    public universalTransformObject(typeOfObject: { new() }, objectToTransform) {
        return !objectToTransform ?
            objectToTransform :
            new typeOfObject().fromJSON(objectToTransform);
    }
}
