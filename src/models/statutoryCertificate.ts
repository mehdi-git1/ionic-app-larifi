import { VAM } from './statutoryCertificate/vam';
import { AnnualElearning } from './statutoryCertificate/annualElearning';
import { MasteringQualification } from './statutoryCertificate/masteringQualification';
import { FamiliarizationFlights } from './statutoryCertificate/familiarizationFlights';
import { PlaneSkill } from './statutoryCertificate/planeSkill';
import { GeneralitySkills } from './statutoryCertificate/generalitySkills';
import { EDossierPncObject } from './eDossierPncObject';

export class StatutoryCertificate extends EDossierPncObject {
    matricule: string;
    aircraftSkills: Array<string>;
    generalitySkills: GeneralitySkills;
    planeSkills: Array<PlaneSkill>;
    familiarizationFlights: FamiliarizationFlights;
    masteringQualification: MasteringQualification;
    annualElearning: AnnualElearning;
    vam: VAM;

    getStorageId(): string {
        return `${this.matricule}`;
    }
}
