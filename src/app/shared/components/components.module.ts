import { IonicModule } from 'ionic-angular';
import { DatePipe, CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RotationCardComponent } from './rotation-card/rotation-card';
import { OfflineIndicatorComponent } from './offline-indicator/offline-indicator';
import { ConnectivityIndicatorComponent } from './connectivity-indicator/connectivity-indicator';
import { DownloadButtonComponent } from './download-button/download-button';
import { PncCardComponent } from './pnc-card/pnc-card';
import { FlightCardComponent } from './flight-card/flight-card';
import { SharedModule } from '../shared.module';
import { EdossierSpinnerComponent } from './edossier-spinner/edossier-spinner';
import { NavBarCustomComponent } from './edossier-indicators/edossier-indicators';
import { PncSearchFilterComponent } from './pnc-search-filter/pnc-search-filter';
import { PncPhotoComponent } from './pnc-photo/pnc-photo';
import { PageHeaderComponent } from './page-header/page-header';
import { CareerObjectiveCardComponent } from './career-objective-card/career-objective-card';

import { PinPadModal } from './modals/pin-pad-modal/pin-pad-modal';
import { PinPadComponent } from './pin-pad/pin-pad';
import { GeneralitySkillsComponent } from './generality-skills/generality-skills';

import { SecretQuestionComponent } from './secret-question/secret-question';
import { SecretQuestionModal } from './modals/secret-question-modal/secret-question-modal';

import { PlaneSkillsComponent } from './plane-skills/plane-skills';
import { StatutoryCertificateDataComponent } from './statutory-certificate-data/statutory-certificate-data';
import { StatutoryCertificateVamComponent } from './statutory-certificate-vam/statutory-certificate-vam';
import { MasteringQualificationComponent } from './mastering-qualification/mastering-qualification';
import { FamiliarizationFlightComponent } from './familiarization-flight/familiarization-flight';

import { TabNavComponent } from './tab-nav/tab-nav';
import { ProfessionalLevelStageComponent } from './professional-level-stage/professional-level-stage';
import { ModuleCardComponent } from './module-card/module-card';
import { NoDataComponent } from './no-data/no-data';
import { DirectivesModule } from '../directives/directives.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    DirectivesModule
  ],
  declarations: [
    RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    FlightCardComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModal,
    SecretQuestionModal,
    SecretQuestionComponent,
    NavBarCustomComponent,
    PncSearchFilterComponent,
    PncPhotoComponent,
    PageHeaderComponent,
    CareerObjectiveCardComponent,
    StatutoryCertificateDataComponent,
    GeneralitySkillsComponent,
    PlaneSkillsComponent,
    StatutoryCertificateVamComponent,
    MasteringQualificationComponent,
    FamiliarizationFlightComponent,
    TabNavComponent,
    ProfessionalLevelStageComponent,
    ModuleCardComponent,
    NoDataComponent
  ],
  exports: [
    RotationCardComponent,
    OfflineIndicatorComponent,
    ConnectivityIndicatorComponent,
    DownloadButtonComponent,
    PncCardComponent,
    FlightCardComponent,
    EdossierSpinnerComponent,
    PinPadComponent,
    PinPadModal,
    SecretQuestionModal,
    SecretQuestionComponent,
    PageHeaderComponent,
    NavBarCustomComponent,
    PncSearchFilterComponent,
    PncPhotoComponent,
    CareerObjectiveCardComponent,
    StatutoryCertificateDataComponent,
    GeneralitySkillsComponent,
    PlaneSkillsComponent,
    StatutoryCertificateVamComponent,
    MasteringQualificationComponent,
    FamiliarizationFlightComponent,
    TabNavComponent,
    ProfessionalLevelStageComponent,
    ModuleCardComponent,
    NoDataComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    PinPadModal,
    SecretQuestionModal
  ]
})
export class ComponentsModule { }
