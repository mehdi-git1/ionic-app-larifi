import { PriorityDropdownListComponent } from './components/priority-dropdown-list/priority-dropdown-list.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {PncSearchPage} from './pages/pnc-search/pnc-search.page';
import {PncSearchFilterComponent} from './components/pnc-search-filter/pnc-search-filter.component';


@NgModule({
  declarations: [
    PncSearchPage,
    PncSearchFilterComponent,
    PriorityDropdownListComponent
  ],
  imports: [
    [IonicPageModule.forChild(PncSearchPage)],
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    PncSearchPage,
    PriorityDropdownListComponent
  ],
  exports: [
    PncSearchPage,
    PriorityDropdownListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class PncTeamModule{}
