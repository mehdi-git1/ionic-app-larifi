import { AbnormalLevelComponent } from './components/abnormal-level/abnormal-level.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { EObservationComponent } from './components/e-observation/e-observation.component';
import { EObservationsComponent } from './components/e-observations/e-observations.component';


@NgModule({
  declarations: [
    EObservationComponent,
    EObservationsComponent,
    AbnormalLevelComponent,
  ],
  imports: [
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
  ],
  exports: [
    EObservationComponent,
    EObservationsComponent,
    AbnormalLevelComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class EObservationModule { }
