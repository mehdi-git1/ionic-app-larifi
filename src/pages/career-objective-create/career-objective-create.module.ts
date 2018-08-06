import { CareerObjectiveCreatePage } from './career-objective-create';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CareerObjectiveCreatePage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(CareerObjectiveCreatePage)
  ],
  exports: [
    CareerObjectiveCreatePage
  ]
})
export class CareerObjectiveCreatePageModule {}
