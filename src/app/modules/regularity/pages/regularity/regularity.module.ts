import { ComponentsModule } from './../../../../shared/components/components.module';
import { SharedModule } from './../../../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { RegularityComponent } from './regularity.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';




@NgModule({
  declarations: [RegularityComponent],
  exports: [RegularityComponent],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegularityModule { }
