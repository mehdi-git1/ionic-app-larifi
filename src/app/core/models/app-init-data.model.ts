import { DivisionModel } from './division.model';
import { LogbookEventCategory } from './logbook/logbook-event-category';
import { ProfessionalInterviewModel } from './professional-interview/professional-interview.model';
import { RelayModel } from './statutory-certificate/relay.model';

export class AppInitDataModel {
    divisionSectorGinqTree: Array<DivisionModel>;

    defaultDivision: string;

    defaultSector: string;
    defaultGinq: string;

    relays: Array<RelayModel>;

    aircraftSkills: Array<string>;

    blankProfessionalInterview: ProfessionalInterviewModel;

    logbookEventCategories: Array<LogbookEventCategory>;

    attachmentsMaxSize: number;
}
