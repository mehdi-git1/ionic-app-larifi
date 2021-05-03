import { BusinessIndicatorSummaryModel } from "./business-indicator-summary.model";

export class BusinessIndicatorComparisonModel {
  matricule: string;
  startDate: string;
  endDate: string;
  businessIndicatorSummaries: Array<BusinessIndicatorSummaryModel>;
}
