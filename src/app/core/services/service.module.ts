import { NgModule } from '@angular/core';

import { AppVersionAlertService } from './app-version/app-version-alert.service';
import { AppVersionTransformerService } from './app-version/app-version-transformer.service';
import { AppVersionService } from './app-version/app-version.service';
import { AuthorizationService } from './authorization/authorization.service';
import {
    CareerObjectiveStatusService
} from './career-objective-status/career-objective-status.service';
import {
    CareerObjectiveTransformerService
} from './career-objective/career-objective-transformer.service';
import { CareerObjectiveService } from './career-objective/career-objective.service';
import { OfflineCareerObjectiveService } from './career-objective/offline-career-objective.service';
import { OnlineCareerObjectiveService } from './career-objective/online-career-objective.service';
import {
    CongratulationLetterTransformerService
} from './congratulation-letter/congratulation-letter-transformer.service';
import { CongratulationLetterService } from './congratulation-letter/congratulation-letter.service';
import {
    OfflineCongratulationLetterService
} from './congratulation-letter/offline-congratulation-letter.service';
import {
    OnlineCongratulationLetterService
} from './congratulation-letter/online-congratulation-letter.service';
import { ConnectivityService } from './connectivity/connectivity.service';
import { CrewMemberTransformerService } from './crewMember/crew-member-transformer.service';
import { DeviceService } from './device/device.service';
import { DocumentService } from './document/document.service';
import { EObservationTransformerService } from './eobservation/eobservation-transformer.service';
import { EObservationService } from './eobservation/eobservation.service';
import { OfflineEObservationService } from './eobservation/offline-eobservation.service';
import { OnlineEObservationService } from './eobservation/online-eobservation.service';
import { FormsEObservationService } from './forms/forms-e-observation.service';
import { GenderService } from './gender/gender.service';
import { HelpAssetService } from './help-asset/help-asset.service';
import { OnlineHrReportService } from './hr-report/hr-report.service';
import { LegTransformerService } from './leg/leg-transformer.service';
import { LegService } from './leg/leg.service';
import { OfflineLegService } from './leg/offline-leg.service';
import { OnlineLegService } from './leg/online-leg.service';
import { OnlineLogbookEventService } from './logbook/online-logbook-event.service';
import { ModalSecurityService } from './modal/modal-security.service';
import { OfflineService } from './offline/offline.service';
import { PdfGeneratorService } from './pdf-generator/pdf-generator.service';
import { OfflinePncPhotoService } from './pnc-photo/offline-pnc-photo.service';
import { OnlinePncPhotoService } from './pnc-photo/online-pnc-photo.service';
import { PncPhotoTransformerService } from './pnc-photo/pnc-photo-transformer.service';
import { PncPhotoService } from './pnc-photo/pnc-photo.service';
import { OfflinePncService } from './pnc/offline-pnc.service';
import { OnlinePncService } from './pnc/online-pnc.service';
import { PncTransformerService } from './pnc/pnc-transformer.service';
import { PncService } from './pnc/pnc.service';
import {
    OfflineProfessionalInterviewService
} from './professional-interview/offline-professional-interview.service';
import {
    OnlineProfessionalInterviewService
} from './professional-interview/online-professional-interview.service';
import {
    ProfessionalInterviewStatusService
} from './professional-interview/professional-interview-status.service';
import {
    ProfessionalInterviewTransformerService
} from './professional-interview/professional-interview-transformer.service';
import {
    ProfessionalInterviewService
} from './professional-interview/professional-interview.service';
import {
    EvaluationSheetService
} from './professional-level/evaluation-sheet/evaluation-sheet.service';
import {
    OfflineEvaluationSheetService
} from './professional-level/evaluation-sheet/offline-evaluation-sheet.service';
import {
    OnlineEvaluationSheetService
} from './professional-level/evaluation-sheet/online-evaluation-sheet.service';
import {
    OfflineProfessionalLevelService
} from './professional-level/offline-professional-level.service';
import {
    OnlineProfessionalLevelService
} from './professional-level/online-professional-level.service';
import {
    ProfessionalLevelTransformerService
} from './professional-level/professional-level-transformer.service';
import { ProfessionalLevelService } from './professional-level/professional-level.service';
import { OfflineRotationService } from './rotation/offline-rotation.service';
import { OnlineRotationService } from './rotation/online-rotation.service';
import { RotationTransformerService } from './rotation/rotation-transformer.service';
import { RotationService } from './rotation/rotation.service';
import { OfflineSecurityService } from './security/offline-security.service';
import { OnlineSecurityService } from './security/online-security.service';
import { SecurityService } from './security/security.service';
import { SessionService } from './session/session.service';
import { SortService } from './sort/sort.service';
import { SpecialityService } from './speciality/speciality.service';
import {
    OfflineStatutoryCertificateService
} from './statutory-certificate/offline-statutory-certificate.service';
import {
    OnlineStatutoryCertificateService
} from './statutory-certificate/online-statutory-certificate.service';
import {
    StatutoryCertificateTransformerService
} from './statutory-certificate/statutory-certificate-transformer.service';
import { StatutoryCertificateService } from './statutory-certificate/statutory-certificate.service';
import { PncSynchroService } from './synchronization/pnc-synchro.service';
import {
    SynchronizationManagementService
} from './synchronization/synchronization-management.service';
import { SynchronizationService } from './synchronization/synchronization.service';
import { TabHeaderService } from './tab-header/tab-header.service';
import { TabNavService } from './tab-nav/tab-nav.service';
import { ToastService } from './toast/toast.service';
import { TransformerService } from './transformer/transformer.service';
import { TranslateOrEmptyService } from './translate/translate-or-empty.service';
import { UserMessageAlertService } from './user-message/user-message-alert.service';
import { UserMessageTransformerService } from './user-message/user-message-transformer.service';
import { UserMessageService } from './user-message/user-message.service';
import { UserPermissionService } from './user-permission/user-permission.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { WaypointStatusService } from './waypoint-status/waypoint-status.service';
import { OfflineWaypointService } from './waypoint/offline-waypoint.service';
import { OnlineWaypointService } from './waypoint/online-waypoint.service';
import { WaypointTransformerService } from './waypoint/waypoint-transformer.service';
import { WaypointService } from './waypoint/waypoint.service';

@NgModule({
    declarations: [
    ],
    imports: [
    ],
    providers: [
        ConnectivityService,
        DeviceService,
        TabNavService,
        TabHeaderService,
        TransformerService,
        PncService,
        CareerObjectiveService,
        GenderService,
        ToastService,
        CareerObjectiveStatusService,
        SecurityService,
        SessionService,
        AuthorizationService,
        WaypointService,
        WaypointStatusService,
        RotationService,
        LegService,
        HelpAssetService,
        OfflineService,
        OfflineCareerObjectiveService,
        OfflinePncService,
        OfflineCareerObjectiveService,
        OfflineWaypointService,
        OnlineSecurityService,
        OfflineSecurityService,
        OnlinePncService,
        OnlineCareerObjectiveService,
        OfflineCareerObjectiveService,
        ProfessionalInterviewService,
        OnlineProfessionalInterviewService,
        OfflineProfessionalInterviewService,
        OfflineWaypointService,
        OnlineWaypointService,
        CareerObjectiveTransformerService,
        WaypointTransformerService,
        PncTransformerService,
        SynchronizationService,
        PncSynchroService,
        FormsEObservationService,
        RotationTransformerService,
        LegTransformerService,
        CrewMemberTransformerService,
        OnlineRotationService,
        OfflineRotationService,
        OnlineLegService,
        OfflineLegService,
        ModalSecurityService,
        PncPhotoService,
        OnlinePncPhotoService,
        OfflinePncPhotoService,
        PncPhotoTransformerService,
        StatutoryCertificateService,
        OnlineStatutoryCertificateService,
        OfflineStatutoryCertificateService,
        StatutoryCertificateTransformerService,
        ProfessionalLevelService,
        OnlineProfessionalLevelService,
        OfflineProfessionalLevelService,
        ProfessionalLevelTransformerService,
        SpecialityService,
        EvaluationSheetService,
        OnlineEvaluationSheetService,
        OfflineEvaluationSheetService,
        EObservationService,
        OnlineEObservationService,
        OfflineEObservationService,
        EObservationTransformerService,
        UserMessageAlertService,
        UserMessageService,
        UserMessageTransformerService,
        UserProfileService,
        UserPermissionService,
        CongratulationLetterService,
        OfflineCongratulationLetterService,
        OnlineCongratulationLetterService,
        CongratulationLetterTransformerService,
        TranslateOrEmptyService,
        AppVersionService,
        AppVersionAlertService,
        AppVersionTransformerService,
        SynchronizationManagementService,
        ProfessionalInterviewStatusService,
        ProfessionalInterviewTransformerService,
        OnlineLogbookEventService,
        PdfGeneratorService,
        SortService,
        DocumentService,
        OnlineHrReportService
    ]
})
export class ServiceModule { }

