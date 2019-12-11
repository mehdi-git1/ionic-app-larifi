import { BusinessIndicatorsPage } from './../modules/business-indicators/pages/business-indicators.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {
    AppVersionCreatePage
} from '../modules/admin/pages/app-version/page/app-version-create/app-version-create.page';
import {
    AppVersionListPage
} from '../modules/admin/pages/app-version/page/app-version-list/app-version-list.page';
import {
    ProfileManagementPage
} from '../modules/admin/pages/profile-management/profile-management.page';
import {
    UserMessageManagementPage
} from '../modules/admin/pages/user-message-management/user-message-management.page';
import {
    CareerObjectiveCreatePage
} from '../modules/career-objective/pages/career-objective-create/career-objective-create.page';
import {
    WaypointCreatePage
} from '../modules/career-objective/pages/waypoint-create/waypoint-create.page';
import {
    CongratulationLetterCreatePage
} from '../modules/congratulation-letter/pages/congratulation-letter-create/congratulation-letter-create.page';
import {
    CongratulationLetterDetailPage
} from '../modules/congratulation-letter/pages/congratulation-letter-detail/congratulation-letter-detail.page';
import {
    CongratulationLettersPage
} from '../modules/congratulation-letter/pages/congratulation-letters/congratulation-letters.page';
import {
    DevelopmentProgramPage
} from '../modules/development-program/pages/development-program/development-program.page';
import {
    EobservationDetailsPage
} from '../modules/eobservation/pages/eobservation-details/eobservation-details.page';
import {
    EObservationsArchivesPage
} from '../modules/eobservation/pages/eobservations-archives/eobservations-archives.page';
import {
    FlightCrewListPage
} from '../modules/flight-activity/pages/flight-crew-list/flight-crew-list.page';
import {
    UpcomingFlightListPage
} from '../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import {
    HelpAssetListPage
} from '../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { AuthenticationPage } from '../modules/home/pages/authentication/authentication.page';
import { GenericMessagePage } from '../modules/home/pages/generic-message/generic-message.page';
import { PncHomePage } from '../modules/home/pages/pnc-home/pnc-home.page';
import {
    UnsupportedNavigatorMessagePage
} from '../modules/home/pages/unsupported-navigator/unsupported-navigator-message.page';
import {
    HrDocumentCreatePage
} from '../modules/hr-documents/pages/hr-document-create/hr-document-create.page';
import {
    HrDocumentDetailPage
} from '../modules/hr-documents/pages/hr-document-detail/hr-document-detail.page';
import { HrDocumentsPage } from '../modules/hr-documents/pages/hr-documents/hr-documents.page';
import { LogbookCreatePage } from '../modules/logbook/pages/logbook-create/logbook-create.page';
import {
    LogbookEventDetailsPage
} from '../modules/logbook/pages/logbook-event-details/logbook-event-details.page';
import { LogbookPage } from '../modules/logbook/pages/logbook/logbook.page';
import { PncSearchPage } from '../modules/pnc-team/pages/pnc-search/pnc-search.page';
import {
    ProfessionalInterviewDetailsPage
} from '../modules/professional-interview/pages/professional-interview-details/professional-interview-details.page';
import {
    ProfessionalInterviewsArchivesPage
} from '../modules/professional-interview/pages/professional-interviews-archives/professional-interviews-archives.page';
import {
    NotValidatedQuestionsPage
} from '../modules/professional-level/pages/not-validated-questions/not-validated-questions.page';
import {
    EvaluationSheetPage
} from '../modules/professional-level/pages/professional-level/evaluation-sheet/evaluation-sheet.page';
import {
    ProfessionalLevelPage
} from '../modules/professional-level/pages/professional-level/professional-level.page';
import { RedactionsPage } from '../modules/redactions/pages/redactions.page';
import { ActivityPage } from '../modules/regularity/pages/activity/activity.page';
import {
    AppVersionHistoryPage
} from '../modules/settings/pages/app-version-history/app-version-history.page';
import { ImpersonatePage } from '../modules/settings/pages/impersonate/impersonate.page';
import { LegalTermsPage } from '../modules/settings/pages/legal-terms/legal-terms.page';
import { SettingsPage } from '../modules/settings/pages/settings/settings.page';
import {
    StatutoryCertificatePage
} from '../modules/statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import {
    SynchronizationManagementPage
} from '../modules/synchronization/pages/synchronization-management/synchronization-management.page';
import { BootstrapComponent } from '../shared/components/bootstrap/bootstrap.component';
import {
    PageNotFoundComponent
} from '../shared/components/page-not-found/page-not-found.component';
import { TabNavComponent } from '../shared/components/tab-nav/tab-nav.component';
import { AdminGuard } from './guards/admin.guard';
import { CanDeactivateGuard } from './guards/form-changes.guard';
import { HomeGuard } from './guards/home.guard';
import { RealAdminGuard } from './guards/real-admin.guard';
import { TeacherGuard } from './guards/teacher-guard';
import { VisitEdossierRedirectionGuard } from './guards/visit-edossier-redirection.guard';
import { VisitEdossierGuard } from './guards/visit-edossier.guard';

const routes: Routes = [
  {
    path: 'tabs', component: TabNavComponent,
    children: [
      {
        path: 'home', children: [
          { path: '', component: PncHomePage },
          {
            path: 'professional-level', children: [
              { path: '', component: ProfessionalLevelPage },
              { path: 'evaluation-sheet/:moduleId', component: EvaluationSheetPage },
              { path: 'not-validated-question', component: NotValidatedQuestionsPage },
              {
                path: 'eobservation', children: [
                  { path: 'detail/:eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
                ]
              }
            ]
          },
          { path: 'statutory-certificate', component: StatutoryCertificatePage },
          { path: 'statutory-certificate/:selectedTab', component: StatutoryCertificatePage },
          {
            path: 'congratulation-letter', children: [
              { path: '', component: CongratulationLettersPage },
              { path: 'create/:congratulationLetterId', component: CongratulationLetterCreatePage },
              { path: 'detail/:congratulationLetterId', component: CongratulationLetterDetailPage }
            ]
          },
          { path: 'redactions', component: RedactionsPage },
          { path: 'business-indicators', component: BusinessIndicatorsPage},
          { path: 'career-objective', children: [
              { path: 'create/:careerObjectiveId', component: CareerObjectiveCreatePage, canDeactivate: [CanDeactivateGuard] },
              {
                path: 'waypoint', children: [
                  { path: ':careerObjectiveId/:waypointId', component: WaypointCreatePage, canDeactivate: [CanDeactivateGuard] }
                ]
              }
            ]
          },
          {
            path: 'eobservation', children: [
              {
                path: 'archive', children: [
                  { path: '', component: EObservationsArchivesPage },
                  { path: ':eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
                ]
              },
              { path: 'detail/:eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
            ]
          },
          {
            path: 'professional-interview', children: [
              { path: 'create', component: ProfessionalInterviewDetailsPage, canDeactivate: [CanDeactivateGuard] },
              { path: 'detail/:professionalInterviewId', component: ProfessionalInterviewDetailsPage, canDeactivate: [CanDeactivateGuard] },
              {
                path: 'archive', children: [
                  { path: '', component: ProfessionalInterviewsArchivesPage },
                  { path: ':professionalInterviewId', component: ProfessionalInterviewDetailsPage }
                ]
              }
            ]
          },
        ]
      },
      {
        path: 'search', children: [
          { path: '', component: PncSearchPage }
        ]
      },
      {
        path: 'flight', children: [
          { path: '', component: UpcomingFlightListPage },
          { path: 'crew-list', component: FlightCrewListPage }
        ]
      },
      {
        path: 'visit', children: [
          { path: '', component: BootstrapComponent, canActivate: [VisitEdossierRedirectionGuard] },
          {
            path: ':matricule', canActivate: [VisitEdossierGuard], children: [
              { path: 'statutory-certificate', component: StatutoryCertificatePage },
              { path: 'statutory-certificate/:selectedTab', component: StatutoryCertificatePage },
              { path: 'help-asset', component: HelpAssetListPage },
              { path: 'redactions', component: RedactionsPage },
              { path: 'business-indicators', component: BusinessIndicatorsPage},
              { path: 'development-program', component: DevelopmentProgramPage},
              {
                path: 'career-objective', children: [
                  { path: 'create/:careerObjectiveId', component: CareerObjectiveCreatePage, canDeactivate: [CanDeactivateGuard] },
                  {
                    path: 'waypoint', children: [
                      { path: ':careerObjectiveId/:waypointId', component: WaypointCreatePage, canDeactivate: [CanDeactivateGuard] }
                    ]
                  }
                ]
              },
              {
                path: 'eobservation', children: [
                  {
                    path: 'archive', children: [
                      { path: '', component: EObservationsArchivesPage },
                      { path: ':eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
                    ]
                  },
                  { path: 'detail/:eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
                ]
              },
              {
                path: 'professional-interview', children: [
                  { path: 'create', component: ProfessionalInterviewDetailsPage, canDeactivate: [CanDeactivateGuard] },
                  { path: 'detail/:professionalInterviewId', component: ProfessionalInterviewDetailsPage, canDeactivate: [CanDeactivateGuard] },
                  {
                    path: 'archive', children: [
                      { path: '', component: ProfessionalInterviewsArchivesPage },
                      { path: ':professionalInterviewId', component: ProfessionalInterviewDetailsPage }
                    ]
                  }
                ]
              },
              {
                path: 'hr-document', children: [
                  { path: '', component: HrDocumentsPage },
                  { path: 'create/:hrDocumentId', component: HrDocumentCreatePage, canDeactivate: [CanDeactivateGuard] },
                  { path: 'detail/:hrDocumentId', component: HrDocumentDetailPage }
                ]
              },
              {
                path: 'professional-level', children: [
                  { path: '', component: ProfessionalLevelPage },
                  { path: 'evaluation-sheet/:moduleId', component: EvaluationSheetPage },
                  { path: 'not-validated-question', component: NotValidatedQuestionsPage },
                  {
                    path: 'eobservation', children: [
                      { path: 'detail/:eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
                    ]
                  }
                ]
              },
              {
                path: 'flight', children: [
                  { path: '', component: UpcomingFlightListPage },
                  { path: 'crew-list', component: FlightCrewListPage }
                ]
              },
              {
                path: 'congratulation-letter', children: [
                  { path: '', component: CongratulationLettersPage },
                  {
                    path: 'create/:congratulationLetterId',
                    component: CongratulationLetterCreatePage, canDeactivate: [CanDeactivateGuard]
                  },
                  { path: 'detail/:congratulationLetterId', component: CongratulationLetterDetailPage }
                ]
              },
              { path: 'activity', component: ActivityPage },
              { path: 'activity/:selectedTab', component: ActivityPage },
              {
                path: 'logbook', children: [
                  { path: '', component: LogbookPage },
                  { path: 'create', component: LogbookCreatePage, canDeactivate: [CanDeactivateGuard] },
                  { path: 'detail/:groupId/:createLinkedEvent', component: LogbookEventDetailsPage, canDeactivate: [CanDeactivateGuard] }
                ]
              },
            ]
          }
        ]
      },
      {
        path: 'help', children: [
          { path: '', component: HelpAssetListPage }
        ]
      }
    ]
  },
  { path: 'unsupported-navigator', component: UnsupportedNavigatorMessagePage },
  { path: 'generic-message', component: GenericMessagePage },
  { path: 'authentication', component: AuthenticationPage },
  {
    // Routes utilisées quand un PNC tuteur consulte le dossier d'un alternant
    path: 'visit/:visitedPncMatricule', canActivate: [TeacherGuard], children: [
      { path: 'development-program', component: DevelopmentProgramPage },
      {
        path: 'eobservation', children: [
          { path: 'detail/:eObservationId', component: EobservationDetailsPage }
        ]
      },
    ]
  },
  { path: 'development-program', component: DevelopmentProgramPage },
  {
    path: 'career-objective', children: [
      { path: 'create/:careerObjectiveId', component: CareerObjectiveCreatePage, canDeactivate: [CanDeactivateGuard] },
      {
        path: 'waypoint', children: [
          { path: ':careerObjectiveId/:waypointId', component: WaypointCreatePage, canDeactivate: [CanDeactivateGuard] }
        ]
      }
    ]
  },
  {
    path: 'eobservation', children: [
      { path: 'detail/:eObservationId', component: EobservationDetailsPage }
    ]
  },
  {
    path: 'professional-interview', children: [
      { path: 'detail/:professionalInterviewId', component: ProfessionalInterviewDetailsPage }
    ]
  },
  {
    path: 'flight', children: [
      { path: '', component: UpcomingFlightListPage },
      { path: 'crew-list', component: FlightCrewListPage }
    ]
  },
  {
    path: 'hr-document', children: [
      { path: '', component: HrDocumentsPage },
      { path: 'detail/:hrDocumentId', component: HrDocumentDetailPage }
    ]
  },
  {
    path: 'professional-level', children: [
      { path: '', component: ProfessionalLevelPage },
      { path: 'evaluation-sheet/:moduleId', component: EvaluationSheetPage },
      { path: 'not-validated-question', component: NotValidatedQuestionsPage },
      {
        path: 'archive', children: [
          { path: '', component: EObservationsArchivesPage },
          { path: ':eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
        ]
      },
      {
        path: 'eobservation', children: [
          { path: 'detail/:eObservationId', component: EobservationDetailsPage, canDeactivate: [CanDeactivateGuard] }
        ]
      }
    ]
  },
  {
    path: 'professional-interview', children: [
      { path: 'create', component: ProfessionalInterviewDetailsPage, canDeactivate: [CanDeactivateGuard] },
      { path: 'detail/:professionalInterviewId', component: ProfessionalInterviewDetailsPage, canDeactivate: [CanDeactivateGuard] },
      { path: 'archive', component: ProfessionalInterviewsArchivesPage }
    ]
  },
  {
    path: 'congratulation-letter', children: [
      { path: '', component: CongratulationLettersPage },
      { path: 'create/:congratulationLetterId', component: CongratulationLetterCreatePage, canDeactivate: [CanDeactivateGuard] },
      { path: 'detail/:congratulationLetterId', component: CongratulationLetterDetailPage }
    ]
  },
  {
    path: 'logbook', children: [
      { path: '', component: LogbookPage },
      { path: 'detail/:groupId/:createLinkedEvent', component: LogbookEventDetailsPage, canDeactivate: [CanDeactivateGuard] },
      { path: 'create', component: LogbookCreatePage, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  { path: 'statutory-certificate', component: StatutoryCertificatePage },
  { path: 'statutory-certificate/:selectedTab', component: StatutoryCertificatePage },
  { path: 'redactions', component: RedactionsPage },
  { path: 'business-indicators', component: BusinessIndicatorsPage},
  { path: 'help-asset', component: HelpAssetListPage },
  { path: 'activity', component: ActivityPage },
  { path: 'settings', component: SettingsPage },
  { path: 'legal-term', component: LegalTermsPage },
  { path: 'app-version-history', component: AppVersionHistoryPage },
  { path: 'synchronization-management', component: SynchronizationManagementPage },
  // ADMIN
  { path: 'admin/impersonate', canActivate: [RealAdminGuard], component: ImpersonatePage },
  {
    path: 'admin', canActivate: [AdminGuard], children: [
      {
        path: 'app-version', children: [
          { path: 'list', component: AppVersionListPage },
          { path: 'create/:appVersionId', component: AppVersionCreatePage, canDeactivate: [CanDeactivateGuard] }
        ]
      },
      { path: 'profile-management', component: ProfileManagementPage },
      { path: 'user-message-management', component: UserMessageManagementPage }
    ]
  },
  { path: '', component: BootstrapComponent, canActivate: [HomeGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    HomeGuard,
    AdminGuard,
    RealAdminGuard,
    CanDeactivateGuard,
    VisitEdossierGuard,
    VisitEdossierRedirectionGuard,
    TeacherGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
