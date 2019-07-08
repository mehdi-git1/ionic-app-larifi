import { DivisionModel } from './division.model';
import { ProfessionalInterviewModel } from './professional-interview/professional-interview.model';
import { LogbookEventCategory } from './logbook/logbook-event-category';
export class AppInitDataModel {
    divisionSectorGinqTree: Array<DivisionModel>;

    defaultDivision: string;

    defaultSector: string;
    defaultGinq: string;

    relays: Array<string>;

    aircraftSkills: Array<string>;

    blankProfessionalInterview: ProfessionalInterviewModel;

    logbookEventCategories: Array<LogbookEventCategory>;
}
