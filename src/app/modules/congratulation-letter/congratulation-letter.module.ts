import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import {
    CongratulationLetterActionMenuComponent
} from './components/congratulation-letter-action-menu/congratulation-letter-action-menu.component';
import {
    CongratulationLetterCardComponent
} from './components/congratulation-letter-card/congratulation-letter-card.component';
import {
    CongratulationLetterListComponent
} from './components/congratulation-letter-list/congratulation-letter-list.component';
import { FixRecipientComponent } from './components/fix-recipient/fix-recipient.component';
import { WarningTextComponent } from './components/warning-text/warning-text.component';
import {
    CongratulationLetterCreatePage
} from './pages/congratulation-letter-create/congratulation-letter-create.page';
import {
    CongratulationLetterDetailPage
} from './pages/congratulation-letter-detail/congratulation-letter-detail.page';
import {
    CongratulationLettersPage
} from './pages/congratulation-letters/congratulation-letters.page';

@NgModule({
  declarations: [
    CongratulationLettersPage,
    CongratulationLetterDetailPage,
    CongratulationLetterCreatePage,
    CongratulationLetterListComponent,
    CongratulationLetterCardComponent,
    WarningTextComponent,
    CongratulationLetterActionMenuComponent,
    FixRecipientComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    CongratulationLettersPage,
    CongratulationLetterDetailPage,
    CongratulationLetterActionMenuComponent,
    FixRecipientComponent,
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
