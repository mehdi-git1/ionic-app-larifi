import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { CareerHistoryComponent } from './components/career-history/career-history.component';
import {
    FamiliarizationFlightComponent
} from './components/familiarization-flight/familiarization-flight.component';
import {
    GeneralitySkillsComponent
} from './components/generality-skills/generality-skills.component';
import { LanguagesComponent } from './components/languages/languages.component';
import {
    MasteringQualificationComponent
} from './components/mastering-qualification/mastering-qualification.component';
import {
    MedicalAptitudesComponent
} from './components/medical-aptitudes/medical-aptitudes.component';
import { PlaneSkillsComponent } from './components/plane-skills/plane-skills.component';
import { RelaysComponent } from './components/relay/relays.component';
import {
    StatutoryCertificateDataComponent
} from './components/statutory-certificate-data/statutory-certificate-data.component';
import { TravelDocumentsComponent } from './components/travel-documents/travel-documents.component';
import { StatutoryCertificatePage } from './pages/statutory-certificate/statutory-certificate.page';

@NgModule({
  declarations: [
    StatutoryCertificatePage,
    FamiliarizationFlightComponent,
    GeneralitySkillsComponent,
    MasteringQualificationComponent,
    PlaneSkillsComponent,
    StatutoryCertificateDataComponent,
    MedicalAptitudesComponent,
    LanguagesComponent,
    RelaysComponent,
    TravelDocumentsComponent,
    CareerHistoryComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    StatutoryCertificatePage
  ],
  exports: [
    StatutoryCertificatePage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class StatutoryCertificateModule { }
