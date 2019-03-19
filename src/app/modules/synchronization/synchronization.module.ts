import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { SynchronizationManagementPage } from './pages/synchronization-management/synchronization-management.page';
import { SynchroRequestListComponent } from './components/synchro-request-list/synchro-request-list.component';
import { SynchroRequestCardComponent } from './components/synchro-request-card/synchro-request-card.component';

@NgModule({
  declarations: [
    SynchronizationManagementPage,
    SynchroRequestListComponent,
    SynchroRequestCardComponent
  ],
  imports: [
    [IonicPageModule.forChild(SynchronizationManagementPage)],
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
