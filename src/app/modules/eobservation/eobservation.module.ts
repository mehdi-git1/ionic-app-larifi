import { AbnormalLevelComponent } from './components/abnormal-level/abnormal-level.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';


@NgModule({
  declarations: [
    AbnormalLevelComponent,
  ],
  imports: [
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
  ],
  exports: [
    AbnormalLevelComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class EObservationModule { }
