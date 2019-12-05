import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import {
    ProfessionalInterviewComponent
} from './components/professional-interview/professional-interview.component';
import {
    ProfessionalInterviewsComponent
} from './components/professional-interviews/professional-interviews.component';
import {
    ProfessionalInterviewDetailsPage
} from './pages/professional-interview-details/professional-interview-details.page';
import {
    ProfessionalInterviewsArchivesPage
} from './pages/professional-interviews-archives/professional-interviews-archives.page';
import { ProfessionalInterviewListComponent } from './components/professional-interview-list/professional-interview-list.component';

@NgModule({
  declarations: [
    ProfessionalInterviewDetailsPage,
    ProfessionalInterviewsArchivesPage,
    ProfessionalInterviewComponent,
    ProfessionalInterviewsComponent,
    ProfessionalInterviewListComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    ProfessionalInterviewDetailsPage,
    ProfessionalInterviewsArchivesPage,
    ProfessionalInterviewComponent,
    ProfessionalInterviewsComponent,
    ProfessionalInterviewListComponent
  ],
  exports: [
    ProfessionalInterviewDetailsPage,
    ProfessionalInterviewsArchivesPage,
    ProfessionalInterviewComponent,
    ProfessionalInterviewsComponent,
    ProfessionalInterviewListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class ProfessionalInterviewModule { }
