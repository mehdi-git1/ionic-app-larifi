import { ComponentsModule } from 'src/app/shared/components/components.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { MilestoneComponent } from '../../components/milestone/milestone.component';
import { RegularityComponent } from '../../components/regularity/regularity.component';
import { ActivityPage } from './activity.page';

@NgModule({
  declarations: [ActivityPage, MilestoneComponent, RegularityComponent],
  exports: [ActivityPage, MilestoneComponent, RegularityComponent],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityModule { }
