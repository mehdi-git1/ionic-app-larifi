import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import {
    SynchroRequestCardComponent
} from './components/synchro-request-card/synchro-request-card.component';
import {
    SynchroRequestListComponent
} from './components/synchro-request-list/synchro-request-list.component';
import {
    SynchronizationManagementPage
} from './pages/synchronization-management/synchronization-management.page';

@NgModule({
  declarations: [
    SynchronizationManagementPage,
    SynchroRequestListComponent,
    SynchroRequestCardComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule
  ],
  entryComponents: [
    SynchronizationManagementPage
  ],
  exports: [
    SynchronizationManagementPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: []
})

export class SynchronizationModule { }
