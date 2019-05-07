import { ProfessionalInterviewDetailsPage } from './pages/professional-interview-details/professional-interview-details.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { ProfessionalInterviewsArchivesPage } from './pages/professional-interviews-archives/professional-interviews-archives.page';
import { ProfessionalInterviewComponent } from './components/professional-interview/professional-interview.component';
import { ProfessionalInterviewsComponent } from './components/professional-interviews/professional-interviews.component';


@NgModule({
  declarations: [
    ProfessionalInterviewDetailsPage,
    ProfessionalInterviewsArchivesPage,
    ProfessionalInterviewComponent,
    ProfessionalInterviewsComponent
  ],
  imports: [
    IonicPageModule.forChild(ProfessionalInterviewDetailsPage),
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    ProfessionalInterviewDetailsPage,
    ProfessionalInterviewsArchivesPage,
    ProfessionalInterviewComponent,
    ProfessionalInterviewsComponent
  ],
  exports: [
    ProfessionalInterviewDetailsPage,
    ProfessionalInterviewsArchivesPage,
    ProfessionalInterviewComponent,
    ProfessionalInterviewsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class ProfessionalInterviewModule { }
