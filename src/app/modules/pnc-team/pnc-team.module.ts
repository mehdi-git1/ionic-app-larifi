import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import {
    PncSearchFilterComponent
} from './components/pnc-search-filter/pnc-search-filter.component';
import { PncSearchPage } from './pages/pnc-search/pnc-search.page';

@NgModule({
  declarations: [
    PncSearchPage,
    PncSearchFilterComponent,
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    PncSearchPage,
  ],
  exports: [
    PncSearchPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class PncTeamModule { }
