import { UserProfileService } from './user-profile/user-profile.service';
import { VersionService } from './version/version.service';
import { NgModule } from '@angular/core';
import { ConnectivityService } from './connectivity/connectivity.service';
import { TabNavService } from './tab-nav/tab-nav.service';
import { DeviceService } from './device/device.service';
import { TransformerService } from './transformer/transformer.service';
import { SessionService } from './session/session.service';
import { AppInitService } from './app-init/app-init.service';
import { PncService } from './pnc/pnc.service';
import { CareerObjectiveService } from './career-objective/career-objective.service';
import { GenderService } from './gender/gender.service';
import { ToastService } from './toast/toast.service';
import { CareerObjectiveStatusService } from './career-objective-status/career-objective-status.service';
import { SecurityServer } from './security/security.server';
import { AuthorizationService } from './authorization/authorization.service';
import { WaypointService } from './waypoint/waypoint.service';
import { WaypointStatusService } from './waypoint-status/waypoint-status.service';
import { RotationService } from './rotation/rotation.service';
import { LegService } from './leg/leg.service';
import { ParametersService } from './parameters/parameters.service';
import { HelpAssetService } from './help-asset/help-asset.service';
import { OfflineService } from './offline/offline.service';
import { OfflineCareerObjectiveService } from './career-objective/offline-career-objective.service';
import { OfflinePncService } from './pnc/offline-pnc.service';
import { OfflineWaypointService } from './waypoint/offline-waypoint.service';
import { OnlineSecurityService } from './security/online-security.service';
import { OfflineSecurityService } from './security/offline-security.service';
import { OnlinePncService } from './pnc/online-pnc.service';
import { OnlineCareerObjectiveService } from './career-objective/online-career-objective';
import { OnlineWaypointService } from './waypoint/online-waypoint.service';
import { CareerObjectiveTransformerService } from './career-objective/career-objective-transformer.service';
import { SynchronizationService } from './synchronization/synchronization.service';
import { PncTransformerService } from './pnc/pnc-transformer.service';
import { WaypointTransformerService } from './waypoint/waypoint-transformer.service';
import { PncSynchroService } from './synchronization/pnc-synchro.service';
import { EFormsEObservationService } from './e-forms/e-forms-e-observation.service';
import { SummarySheetTransformerService } from './summary-sheet/summary-sheet-transformer.service';
import { OfflinePncPhotoService } from './pnc-photo/offline-pnc-photo.service';
import { ProfessionalLevelService } from './professional-level/professional-level.service';
import { PncPhotoTransformerService } from './pnc-photo/pnc-photo-transformer.service';
import { EObservationTransformerService } from './e-observation/e-observation-transformer.service';
import { RotationTransformerService } from './rotation/rotation-transformer.service';
import { SpecialityService } from './speciality/speciality.service';
import { SummarySheetService } from './summary-sheet/summary-sheet.service';
import { OfflineEObservationService } from './e-observation/offline-e-observation.service';
import { OnlineProfessionalLevelService } from './professional-level/online-professional-level.service';
import { OnlineLegService } from './leg/online-leg.service';
import { ProfessionalLevelTransformerService } from './professional-level/professional-level-transformer.service';
import { OnlinePncPhotoService } from './pnc-photo/online-pnc-photo.service';
import { ModalSecurityService } from './modal/modal-security.service';
import { OfflineLegService } from './leg/offline-leg.service';
import { OnlineStatutoryCertificateService } from './statutory-certificate/online-statutory-certificate.service';
import { OnlineEObservationService } from './e-observation/online-e-observation.service';
import { PncPhotoService } from './pnc-photo/pnc-photo.service';
import { OfflineStatutoryCertificateService } from './statutory-certificate/offline-statutory-certificate.service';
import { StatutoryCertificateTransformerService } from './statutory-certificate/statutory-certificate-transformer.service';
import { OfflineRotationService } from './rotation/offline-rotation.service';
import { OfflineProfessionalLevelService } from './professional-level/offline-professional-level.service';
import { StatutoryCertificateService } from './statutory-certificate/statutory-certificate.service';
import { OfflineSummarySheetService } from './summary-sheet/offline-summary-sheet.service';
import { OnlineRotationService } from './rotation/online-rotation.service';
import { OnlineSummarySheetService } from './summary-sheet/online-summary-sheet.service';
import { LegTransformerService } from './leg/leg-transformer.service';
import { CrewMemberTransformerService } from './crewMember/crew-member-transformer.service';
import { EObservationService } from './e-observation/e-observation.service';


@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    ConnectivityService,
    DeviceService,
    TabNavService,
    TransformerService,
    AppInitService,
    PncService,
    CareerObjectiveService,
    GenderService,
    ToastService,
    CareerObjectiveStatusService,
    SecurityServer,
    SessionService,
    AuthorizationService,
    WaypointService,
    WaypointStatusService,
    RotationService,
    LegService,
    ParametersService,
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
    OfflineWaypointService,
    OnlineWaypointService,
    CareerObjectiveTransformerService,
    WaypointTransformerService,
    PncTransformerService,
    SynchronizationService,
    PncSynchroService,
    EFormsEObservationService,
    SummarySheetService,
    RotationTransformerService,
    LegTransformerService,
    CrewMemberTransformerService,
    OnlineSummarySheetService,
    OfflineSummarySheetService,
    SummarySheetTransformerService,
    OnlineRotationService,
    OfflineRotationService,
    OnlineLegService,
    OfflineLegService,
    ModalSecurityService,
    PncPhotoService,
    OnlinePncPhotoService,
    OfflinePncPhotoService,
    PncPhotoTransformerService,
    EObservationService,
    OfflineEObservationService,
    OnlineEObservationService,
    EObservationTransformerService,
    StatutoryCertificateService,
    OnlineStatutoryCertificateService,
    OfflineStatutoryCertificateService,
    StatutoryCertificateTransformerService,
    ProfessionalLevelService,
    OnlineProfessionalLevelService,
    OfflineProfessionalLevelService,
    ProfessionalLevelTransformerService,
    SpecialityService,
    UserProfileService,
    VersionService
  ]
})
export class ServiceModule { }

