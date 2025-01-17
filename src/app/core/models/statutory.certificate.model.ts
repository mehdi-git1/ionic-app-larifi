import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import { ManifexLightModel } from './manifex/manifex-light.model';
import { AnnualElearningModel } from './statutory-certificate/annual-e-learning.model';
import { FamiliarizationFlightsModel } from './statutory-certificate/familiarization-flights.model';
import { GeneralitySkillsModel } from './statutory-certificate/generality-skills.model';
import { LanguageModel } from './statutory-certificate/language.model';
import { MasteringQualificationModel } from './statutory-certificate/mastering-qualification.model';
import { MedicalVisitsModel } from './statutory-certificate/medical-visits.model';
import { PlaneSkillModel } from './statutory-certificate/plane-skill.model';
import { RelayModel } from './statutory-certificate/relay.model';
import { TravelDocumentsModel } from './statutory-certificate/travel-documents.model';

export class StatutoryCertificateModel extends EDossierPncObjectModel {
    matricule: string;
    aircraftSkills: Array<string>;
    generalitySkills: GeneralitySkillsModel;
    planeSkills: Array<PlaneSkillModel>;
    familiarizationFlights: FamiliarizationFlightsModel;
    masteringQualifications: MasteringQualificationModel;
    annualElearning: AnnualElearningModel;
    medicalVisits: MedicalVisitsModel;
    languages: LanguageModel[];
    relays: RelayModel[];
    travelDocuments: TravelDocumentsModel[];
    manifex: ManifexLightModel;
    manifexDeletionDate: Date;
    manifexPncAgreementDate: Date;

    getStorageId(): string {
        return `${this.matricule}`;
    }
}
