import { ProfessionalInterviewDetailsPage } from './pages/professional-interview-details/professional-interview-details.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { IonicModule, IonicPageModule } from 'ionic-angular';


@NgModule({
  declarations: [
    ProfessionalInterviewDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(ProfessionalInterviewDetailsPage),
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    ProfessionalInterviewDetailsPage,
  ],
  exports: [

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class ProfessionalInterviewModule { }
