import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MyBoardNotificationsListComponent } from './components/my-board-notifications-list/my-board-notifications-list.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MyBoardNotificationsListComponent],
  imports: [
    IonicModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyBoardModule { }
