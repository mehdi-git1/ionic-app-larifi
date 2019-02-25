import { MedicalAptitudesModel } from './../../core/models/statutory-certificate/medical-aptitudes.model';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { StatutoryCertificatePage } from './pages/statutory-certificate/statutory-certificate.page';
import { FamiliarizationFlightComponent } from './components/familiarization-flight/familiarization-flight.component';
import { GeneralitySkillsComponent } from './components/generality-skills/generality-skills.component';
import { MasteringQualificationComponent } from './components/mastering-qualification/mastering-qualification.component';
import { PlaneSkillsComponent } from './components/plane-skills/plane-skills.component';
import { StatutoryCertificateDataComponent } from './components/statutory-certificate-data/statutory-certificate-data.component';


@NgModule({
  declarations: [
    StatutoryCertificatePage,
    FamiliarizationFlightComponent,
    GeneralitySkillsComponent,
    MasteringQualificationComponent,
    PlaneSkillsComponent,
    StatutoryCertificateDataComponent,
    MedicalAptitudesModel
  ],
  imports: [
    [IonicPageModule.forChild(StatutoryCertificatePage)],
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
