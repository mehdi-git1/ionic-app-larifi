import { CareerObjectiveModel } from './career-objective.model';
import { CongratulationLetterModel } from './congratulation-letter.model';
import { CrewMemberModel } from './crew-member.model';
import { EObservationModel } from './eobservation/eobservation.model';
import { PncPhotoModel } from './pnc-photo.model';
import { PncModel } from './pnc.model';
import { ProfessionalInterviewModel } from './professional-interview/professional-interview.model';
import { ProfessionalLevelModel } from './professional-level/professional-level.model';
import { RotationModel } from './rotation.model';
import { StatutoryCertificateModel } from './statutory.certificate.model';
import { WaypointModel } from './waypoint.model';

export class PncSynchroModel {
    pnc: PncModel;
    photo: PncPhotoModel;
    careerObjectives: CareerObjectiveModel[];
    waypoints: WaypointModel[];
    rotations: RotationModel[];
    crewMembers: CrewMemberModel[];
    statutoryCertificate: StatutoryCertificateModel;
    professionalLevel: ProfessionalLevelModel;
    congratulationLetters: CongratulationLetterModel[];
    eobservations: EObservationModel[];
    professionalInterviews: ProfessionalInterviewModel[];
}
