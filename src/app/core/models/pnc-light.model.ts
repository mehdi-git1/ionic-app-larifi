import { SpecialityEnum } from '../enums/speciality.enum';
import { LanguageModel } from './statutory-certificate/language.model';

export class PncLightModel {
    matricule: string;
    firstName: string;
    lastName: string;
    speciality: SpecialityEnum;
    currentSpeciality: SpecialityEnum;
    division: string;
    ginq: string;
    sector: string;
    isInstructor = false;
    isRds = false;
    languages: LanguageModel[];
    class: string;
    rung: string;
    networkMobilityRequest: Date;
    candidacy: Date;

}
