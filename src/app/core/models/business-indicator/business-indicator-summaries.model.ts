import { BusinessIndicatorSummaryModel } from './business-indicator-summary.model';

export class BusinessIndicatorSummariesModel {
  matricule: string;
  startDate: Date;
  endDate: Date;
  businessIndicatorSummaries: Array<BusinessIndicatorSummaryModel>;
  hasNeverFlownAsCcLcDuringPastYear: boolean;
}
