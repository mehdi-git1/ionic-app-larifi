import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { AbnormalLevelComponent } from './components/abnormal-level/abnormal-level.component';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { EObservationComponent } from './components/e-observation/e-observation.component';
import { EObservationsComponent } from './components/e-observations/e-observations.component';
import { EObservationsArchivesPage } from './pages/eobservations-archives/eobservations-archives.page';


@NgModule({
  declarations: [
    EObservationsComponent,
    EObservationComponent,
    AbnormalLevelComponent,
    EObservationsArchivesPage
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    EObservationsArchivesPage
  ],
  exports: [
    EObservationComponent,
    EObservationsComponent,
    AbnormalLevelComponent,
    EObservationsArchivesPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class EObservationModule { }
