import { LanguageModel } from './statutory-certificate/language.model';
import { MedicalAptitudesModel } from './statutory-certificate/medical-aptitudes.model';
import { AnnualElearningModel } from './statutory-certificate/annual-e-learning.model';
import { MasteringQualificationModel } from './statutory-certificate/mastering-qualification.model';
import { FamiliarizationFlightsModel } from './statutory-certificate/familiarization-flights.model';
import { PlaneSkillModel } from './statutory-certificate/plane-skill.model';
import { GeneralitySkillsModel } from './statutory-certificate/generality-skills.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class StatutoryCertificateModel extends EDossierPncObjectModel {
    matricule: string;
    aircraftSkills: Array<string>;
    generalitySkills: GeneralitySkillsModel;
    planeSkills: Array<PlaneSkillModel>;
    familiarizationFlights: FamiliarizationFlightsModel;
    masteringQualification: MasteringQualificationModel;
    annualElearning: AnnualElearningModel;
    medicalAptitudes: MedicalAptitudesModel;
    languages: LanguageModel[];

    getStorageId(): string {
        return `${this.matricule}`;
    }
}
