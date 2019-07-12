import { CongratulationLetterCreatePage } from './pages/congratulation-letter-create/congratulation-letter-create.page';
import { CongratulationLetterDetailPage } from './pages/congratulation-letter-detail/congratulation-letter-detail.page';
import { CongratulationLettersPage } from './pages/congratulation-letters/congratulation-letters.page';
import { CongratulationLetterListComponent } from './components/congratulation-letter-list/congratulation-letter-list.component';
import { CongratulationLetterCardComponent } from './components/congratulation-letter-card/congratulation-letter-card.component';
import { CongratulationLetterActionMenuComponent } from './components/congratulation-letter-action-menu/congratulation-letter-action-menu.component';
import { WarningTextComponent } from './components/warning-text/warning-text.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [
    CongratulationLettersPage,
    CongratulationLetterDetailPage,
    CongratulationLetterCreatePage,
    CongratulationLetterListComponent,
    CongratulationLetterCardComponent,
    WarningTextComponent,
    CongratulationLetterActionMenuComponent
  ],
  imports: [
    [IonicPageModule.forChild(CongratulationLettersPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    CongratulationLettersPage,
    CongratulationLetterDetailPage,
    CongratulationLetterActionMenuComponent,
    CongratulationLetterCreatePage
  ],
  exports: [
    CongratulationLettersPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class CongratulationLetterModule { }
