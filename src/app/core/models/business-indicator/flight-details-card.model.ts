import { HaulTypeEnum } from '../../enums/haul-type.enum';
import { EScoreCommentModel } from './e-score-comment.model';
import { OperatingPerformancesModel } from './operating-performances.model';
import { ShortLoopCommentModel } from './short-loop-comment.model';

export class FlightDetailsCardModel {

    flightNumber: string;
    flightDate: Date;
    legDepartureDate: Date;
    departureStation: string;
    arrivalStation: string;
    aircraftType: string;
    escoreComments: EScoreCommentModel[];
    shortLoopComments: ShortLoopCommentModel[];
    operatingPerformances: OperatingPerformancesModel;
    formSource: string;
    haulType: HaulTypeEnum;
    cdl: string;
    peq: string;
    exploitationVersion: string;
    carriedClientVersion: string;
    escore: number;
    weightingSum: string;
    weightedNotationSum: string;
    numberOfRespondents: number;
    escore0: number;
    escore25: number;
    escore50: number;
    escore75: number;
    escore100: number;
    withoutOpinion: string;
    flightActionsTotalNumber: number;
    erc: number;
    clientContinuity: number;
    flyingBlueEnrolment: number;
    giftForCare: number;
    upgrade: number;
    kdo: number;
    d0: number;
}
