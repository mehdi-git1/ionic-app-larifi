import { EObservationTransformerProvider } from '../app/core/services/e-observation/e-observation-transformer';
import { WaypointTransformerProvider } from '../app/core/services/waypoint/waypoint-transformer';
import { CareerObjectiveTransformerProvider } from '../app/core/services/career-objective/career-objective-transformer';
import { PncTransformerProvider } from '../app/core/services/pnc/pnc-transformer';
import { Entity } from '../app/core/models/entity';
import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../app/core/models/eDossierPncObject';
import { SummarySheetTransformerProvider } from '../app/core/services/summary-sheet/summary-sheet-transformer';

@Injectable()
export class TransformerService {

    constructor(
        private pncTransformer: PncTransformerProvider,
        private careerObjectiveTransformer: CareerObjectiveTransformerProvider,
        private waypointTransformer: WaypointTransformerProvider,
        private eObservationTransformer: EObservationTransformerProvider,
        private summarySheetTransformer: SummarySheetTransformerProvider) {
    }
    /**
     * Appelle le bon transformer et transforme l'objet
     * @param type type de l'objet
     * @param objectToTransform objet a transformer
     */
    public transformObject(type: Entity, objectToTransform: any): EDossierPncObject {
        if (Entity.PNC === type) {
            return this.pncTransformer.toPnc(objectToTransform);
        } else if (Entity.SUMMARY_SHEET === type) {
            return this.summarySheetTransformer.toSummarySheet(objectToTransform);
        } else if (Entity.CAREER_OBJECTIVE === type) {
            return this.careerObjectiveTransformer.toCareerObjective(objectToTransform);
        } else if (Entity.WAYPOINT === type) {
            return this.waypointTransformer.toWaypoint(objectToTransform);
        } else if (Entity.EOBSERVATION === type) {
            return this.eObservationTransformer.toEObservation(objectToTransform);
        } else {
            return objectToTransform;
        }
    }
}
