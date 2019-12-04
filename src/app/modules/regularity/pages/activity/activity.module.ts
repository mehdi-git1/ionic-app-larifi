import { RegularityComponent } from './../../components/regularity/regularity.component';
import { JalonsComponent } from './../../components/jalons/jalons.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { ActivityPage } from './activity.page';

@NgModule({
  declarations: [ActivityPage, JalonsComponent, RegularityComponent],
  exports: [ActivityPage, JalonsComponent, RegularityComponent],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityModule { }
