import { SpecialityEnum } from '../../enums/speciality.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { BusinessIndicatorFlightModel } from './business-indicator-flight.model';
import { EScoreCommentModel } from './e-score-comment.model';
import { ShortLoopCommentModel } from './short-loop-comment.model';

export class BusinessIndicatorModel extends EDossierPncObjectModel {

    pnc: PncModel;
    flight: BusinessIndicatorFlightModel;
    escoreComments: EScoreCommentModel[];
    shortLoopComments: ShortLoopCommentModel[];

    aboardSpeciality: SpecialityEnum;
    formSource: string;
    escore: number;
    eScoreWeight: number;
    weightedEScore: number;
    numberOfRespondents: number;
    escore0: number;
    escore25: number;
    escore50: number;
    escore75: number;
    escore100: number;
    withoutOpinion: number;
    flightActionsTotalNumber: number;
    erc: number;
    clientContinuity: number;
    flyingBlueEnrolment: number;
    giftForCare: number;
    upgrade: number;
    kdo: number;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
