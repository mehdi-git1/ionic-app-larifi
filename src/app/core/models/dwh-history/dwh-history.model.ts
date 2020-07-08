import { EmploymentLevelHistoryModel } from './employment-level-history.model';
import { AssignmentHistoryModel } from './assignment-history.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { SeniorityDateHistoryModel } from './seniority-date-history.model';
import { ExamHistoryModel } from './exam-history.model';
import { InstrumentHistoryModel } from './instrument-history.model';
import { TrainingLabelModel } from './training-label.model';

export class DwhHistoryModel extends EDossierPncObjectModel {

  matricule: string;
  assignmentHistory: AssignmentHistoryModel[];
  employmentLevelHistory: EmploymentLevelHistoryModel[];
  seniorityDateHistory: SeniorityDateHistoryModel[];
  examHistory: ExamHistoryModel[];
  instrumentHistory: InstrumentHistoryModel[];
  trainingsAndLabels: TrainingLabelModel[];

  getStorageId(): string {
    return `${this.matricule}`;
  }
}
