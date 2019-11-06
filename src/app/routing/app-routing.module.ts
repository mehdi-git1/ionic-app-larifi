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
    CongratulationLetterCreatePage
} from '../modules/congratulation-letter/pages/congratulation-letter-create/congratulation-letter-create.page';
import {
    CongratulationLetterDetailPage
} from '../modules/congratulation-letter/pages/congratulation-letter-detail/congratulation-letter-detail.page';
import {
    CongratulationLettersPage
} from '../modules/congratulation-letter/pages/congratulation-letters/congratulation-letters.page';
import {
    CareerObjectiveCreatePage
} from '../modules/development-program/pages/career-objective-create/career-objective-create.page';
import {
    CareerObjectiveListPage
} from '../modules/development-program/pages/career-objective-list/career-objective-list.page';
import {
    WaypointCreatePage
} from '../modules/development-program/pages/waypoint-create/waypoint-create.page';
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
import {
    VisitEdossierComponent
} from '../shared/components/visited-edossier/visited-edossier.component';
import { AdminGuard } from './guards/admin.guard';
import { HomeGuard } from './guards/home.guard';
import { RealAdminGuard } from './guards/real-admin.guard';

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
              { path: 'not-validated-question', component: NotValidatedQuestionsPage }
            ]
          },
          { path: 'statutory-certificate', component: StatutoryCertificatePage },
          {
            path: 'congratulation-letter', children: [
              { path: '', component: CongratulationLettersPage },
              { path: 'create/:congratulationLetterId', component: CongratulationLetterCreatePage },
              { path: 'detail/:congratulationLetterId', component: CongratulationLetterDetailPage }
            ]
          }
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
        path: 'visit', component: VisitEdossierComponent, children: [
          {
            path: ':matricule', children: [
              { path: 'statutory-certificate', component: StatutoryCertificatePage },
              { path: 'help-asset', component: HelpAssetListPage },
              {
                path: 'career-objective', children: [
                  { path: '', component: CareerObjectiveListPage },
                  { path: 'create/:careerObjectiveId', component: CareerObjectiveCreatePage },
                  {
                    path: 'waypoint', children: [
                      { path: ':careerObjectiveId/:waypointId', component: WaypointCreatePage }
                    ]
                  },
                  {
                    path: 'eobservation', children: [
                      { path: 'archive', component: EObservationsArchivesPage },
                      { path: 'detail/:eObservationId', component: EobservationDetailsPage }
                    ]
                  },
                  {
                    path: 'professional-interview', children: [
                      { path: 'create', component: ProfessionalInterviewDetailsPage },
                      { path: 'detail/:professionalInterviewId', component: ProfessionalInterviewDetailsPage },
                      { path: 'archive', component: ProfessionalInterviewsArchivesPage }
                    ]
                  },
                ]
              },
              {
                path: 'professional-level', children: [
                  { path: '', component: ProfessionalLevelPage },
                  { path: 'evaluation-sheet/:moduleId', component: EvaluationSheetPage },
                  { path: 'not-validated-question', component: NotValidatedQuestionsPage },
                  {
                    path: 'eobservation', children: [
                      { path: 'detail/:eObservationId', component: EobservationDetailsPage }
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
                  { path: 'create/:congratulationLetterId', component: CongratulationLetterCreatePage },
                  { path: 'detail/:congratulationLetterId', component: CongratulationLetterDetailPage }
                ]
              },
              {
                path: 'logbook', children: [
                  { path: '', component: LogbookPage },
                  { path: 'create', component: LogbookCreatePage },
                  { path: 'detail/:groupId/:createLinkedEvent', component: LogbookEventDetailsPage }
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
    path: 'career-objective', children: [
      { path: '', component: CareerObjectiveListPage },
      { path: 'create/:careerObjectiveId', component: CareerObjectiveCreatePage },
      {
        path: 'waypoint', children: [
          { path: ':careerObjectiveId/:waypointId', component: WaypointCreatePage }
        ]
      },
    ]
  },
  {
    path: 'flight', children: [
      { path: '', component: UpcomingFlightListPage },
      { path: 'crew-list', component: FlightCrewListPage }
    ]
  },
  {
    path: 'professional-level', children: [
      { path: '', component: ProfessionalLevelPage },
      { path: 'evaluation-sheet/:moduleId', component: EvaluationSheetPage },
      { path: 'not-validated-question', component: NotValidatedQuestionsPage }
    ]
  },
  {
    path: 'eobservation', children: [
      { path: 'archive', component: EObservationsArchivesPage },
      { path: 'detail/:eObservationId', component: EobservationDetailsPage }
    ]
  },
  {
    path: 'professional-interview', children: [
      { path: 'create', component: ProfessionalInterviewDetailsPage },
      { path: 'detail/:professionalInterviewId', component: ProfessionalInterviewDetailsPage },
      { path: 'archive', component: ProfessionalInterviewsArchivesPage }
    ]
  },
  {
    path: 'congratulation-letter', children: [
      { path: '', component: CongratulationLettersPage },
      { path: 'create/:congratulationLetterId', component: CongratulationLetterCreatePage },
      { path: 'detail/:congratulationLetterId', component: CongratulationLetterDetailPage }
    ]
  },
  {
    path: 'logbook', children: [
      { path: '', component: LogbookPage },
      { path: 'detail/:groupId/:createLinkedEvent', component: LogbookEventDetailsPage },
      { path: 'create', component: LogbookCreatePage }
    ]
  },
  { path: 'statutory-certificate', component: StatutoryCertificatePage },
  { path: 'help-asset', component: HelpAssetListPage },
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
          { path: 'create/:appVersionId', component: AppVersionCreatePage }
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
    RealAdminGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }