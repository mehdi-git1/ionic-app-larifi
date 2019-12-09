import { ComponentsModule } from 'src/app/shared/components/components.module';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { RegularityPage } from './regularity.page';

@NgModule({
  declarations: [RegularityPage],
  exports: [RegularityPage],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegularityModule { }
