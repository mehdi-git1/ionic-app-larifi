import { CareerObjectiveListPage } from './career-objective-list';
import { ComponentsModule } from './../../components/components.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CareerObjectiveListPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(CareerObjectiveListPage)
  ],
  exports: [
    CareerObjectiveListPage
  ]
})
export class CareerObjectiveListPageModule {}
