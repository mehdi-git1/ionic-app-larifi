import { VAM } from './statutoryCertificate/vam';
import { AnnualElearning } from './statutoryCertificate/annualElearning';
import { MasteringQualification } from './statutoryCertificate/masteringQualification';
import { FamiliarizationFlight } from './statutoryCertificate/familiarizationFlight';
import { PlaneSkill } from './statutoryCertificate/planeSkill';
import { GeneralitySkills } from './statutoryCertificate/generalitySkills';

export class StatutoryCertificate {
    aircraftSkills: Array<string>;
    generalitySkills: GeneralitySkills;
    planeSkills: Array<PlaneSkill>;
    familiarizationFlights: Array<FamiliarizationFlight> ;
    masteringQualification: MasteringQualification;
    annualElearning: AnnualElearning;
    vam: VAM;
}
