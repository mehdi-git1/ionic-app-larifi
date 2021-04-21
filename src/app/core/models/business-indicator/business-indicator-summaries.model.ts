import { BusinessIndicatorSummaryModel } from './business-indicator-summary.model';

export class BusinessIndicatorSummariesModel {
    matricule: string;
    businessIndicatorSummaries: Array<BusinessIndicatorSummaryModel>;
    hasNeverFlownAsCcLcDuringPastYear: boolean;
}
