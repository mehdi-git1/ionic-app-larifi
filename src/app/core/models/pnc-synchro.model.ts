import { CrewMemberModel } from './crew-member.model';
import { CongratulationLetterModel } from './congratulation-letter.model';
import { ProfessionalLevelModel } from './professional-level/professional-level.model';
import { StatutoryCertificateModel } from './statutory.certificate.model';
import { PncPhotoModel } from './pnc-photo.model';
import { RotationModel } from './rotation.model';
import { WaypointModel } from './waypoint.model';
import { CareerObjectiveModel } from './career-objective.model';
import { PncModel } from './pnc.model';
import { LegModel } from './leg.model';
import { SummarySheetModel } from './summary.sheet.model';
import { EObservationModel } from './eobservation/eobservation.model';

export class PncSynchroModel {
    pnc: PncModel;
    summarySheet: SummarySheetModel;
    photo: PncPhotoModel;
    careerObjectives: CareerObjectiveModel[];
    waypoints: WaypointModel[];
    rotations: RotationModel[];
    crewMembers: CrewMemberModel[];
    legs: LegModel[];
    statutoryCertificate: StatutoryCertificateModel;
    professionalLevel: ProfessionalLevelModel;
    congratulationLetters: CongratulationLetterModel[];
    eobservations: EObservationModel[];
}
