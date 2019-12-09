import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { SpecialityEnum } from '../../enums/speciality.enum';

export class EmploymentLevelHistoryModel  {
    grade: string;
    level: string;
    speciality: SpecialityEnum;
    startDate: Date;
    endDate: Date;
}
