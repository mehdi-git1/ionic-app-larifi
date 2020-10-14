import { AppParameterModel } from './app-parameter.model';
import { CareerObjectiveCategory } from './career-objective-category';
import { DivisionModel } from './division.model';
import { HrDocumentCategory } from './hr-document/hr-document-category';
import { LogbookEventCategory } from './logbook/logbook-event-category';
import { MyBoardInitDataModel } from './my-board/my-board-init-data.model';
import { ProfessionalInterviewModel } from './professional-interview/professional-interview.model';
import { RelayModel } from './statutory-certificate/relay.model';

export class AppInitDataModel {
  divisionSectorGinqTree: Array<DivisionModel>;

  defaultDivision: string;

  defaultSector: string;
  defaultGinq: string;

  relays: Array<RelayModel>;

  aircraftSkills: Array<string>;

  workRates: Array<number>;

  blankProfessionalInterview: ProfessionalInterviewModel;

  logbookEventCategories: Array<LogbookEventCategory>;

  hrDocumentCategories: Array<HrDocumentCategory>;

  careerObjectiveCategories: Array<CareerObjectiveCategory>;

  regularityLinks: Array<AppParameterModel>;

  careerHistoryLinks: Array<AppParameterModel>;

  contactPNLink: AppParameterModel;

  attachmentsMaxSize: number;

  eformsWrittenUrl: string;

  cabinReportsWrittenUrl: string;

  myBoardInitData: MyBoardInitDataModel;
}
