import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { WaypointCreatePage } from './pages/waypoint-create/waypoint-create.page';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { CareerObjectiveListPage } from './pages/career-objective-list/career-objective-list.page';
import { CareerObjectiveCreatePage } from './pages/career-objective-create/career-objective-create.page';
import { CareerObjectiveCardComponent } from './components/career-objective-card/career-objective-card.component';


@NgModule({
  declarations: [
    WaypointCreatePage,
    CareerObjectiveListPage,
    CareerObjectiveCreatePage,
    CareerObjectiveCardComponent
  ],
  imports: [
    [IonicPageModule.forChild(CareerObjectiveListPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    WaypointCreatePage,
    CareerObjectiveCreatePage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class DevelopmentProgramModule { }